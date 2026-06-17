<?php

namespace App\Services;

use App\Models\TestAttempt;
use App\Models\TestAnswer;
use App\Models\User;
use App\Repositories\TestRepository;
use App\Strategies\ScoringFactory;
use Illuminate\Support\Collection;

class TestService
{
    public function __construct(
        private readonly TestRepository $testRepository,
        private readonly ScoringFactory $scoringFactory
    ) {
    }

    public function getAllTests(array $filters = [], User $user): Collection
    {
        return $this->testRepository->getAll(
            $filters,
            $user
        );
    }

    public function getTestById(int $id): mixed
    {
        return $this->testRepository->getById($id);
    }

    public function getTestByCode(string $code): mixed
    {
        return $this->testRepository->getByCode($code);
    }

    public function getAvailableTests(int $userId): Collection
    {
        return $this->testRepository->getAvailableTestsForUser($userId);
    }

    public function getSystemTests(): Collection
    {
        return $this->testRepository->getSystemTests();
    }

    public function getTestWithQuestions(int $testId): mixed
    {
        return $this->testRepository->getTestWithQuestions($testId);
    }

    public function createTest(int $userId, array $data): mixed
    {
        $user = User::findOrFail($userId);

        $data['created_by'] = $userId;

        $data['scope'] =
            $user->role === 'admin'
            ? 'system'
            : 'class';

        return $this->testRepository->createTest($data);
    }

    public function updateTest(int $testId, array $data): mixed
    {
        return $this->testRepository->updateTest($testId, $data);
    }

    public function deleteTest(int $testId): bool
    {
        return $this->testRepository->deleteTest($testId);
    }

    public function canAccessTest(int $userId, int $testId): array
    {
        $test = $this->testRepository->getById($testId);
        $errors = [];

        // Check if test is active
        if (!$test->is_active) {
            return ['can_access' => false, 'error' => 'This test is not active.'];
        }

        // Check expiration
        if ($test->expires_at && $test->expires_at->isPast()) {
            return ['can_access' => false, 'error' => 'This test has expired.'];
        }

        // Check max attempts
        $existingAttempts = $this->testRepository->getAttempts($userId, $testId);
        $completedAttempts = $existingAttempts->where('status', '!=', TestAttempt::STATUS_IN_PROGRESS)->count();

        if ($test->max_attempts && $completedAttempts >= $test->max_attempts) {
            return [
                'can_access' => false,
                'error' => "You have reached the maximum number of attempts ({$test->max_attempts})."
            ];
        }

        // Check for active attempt
        $activeAttempt = $this->testRepository->getActiveAttempt($userId, $testId);

        return [
            'can_access' => true,
            'active_attempt' => $activeAttempt,
            'attempt_count' => $completedAttempts,
        ];
    }

    public function startTest(int $userId, int $testId): array
    {
        $access = $this->canAccessTest($userId, $testId);

        if (!$access['can_access']) {
            return ['success' => false, 'error' => $access['error']];
        }

        // Return existing active attempt if any
        if ($access['active_attempt']) {
            $attempt = $access['active_attempt'];
            if ($attempt->isExpired()) {
                $this->expireAttempt($attempt->id);
                return ['success' => false, 'error' => 'Your previous attempt has expired.'];
            }
            return $this->formatAttemptResponse($attempt);
        }

        // Create new attempt
        $attempt = $this->testRepository->createAttempt($userId, $testId);

        return $this->formatAttemptResponse($attempt);
    }

    public function submitTest(int $attemptId, array $answers): array
    {
        $attempt = TestAttempt::with([
            'test',
            'test.questions'
        ])->findOrFail($attemptId);

        // Check if already submitted
        if ($attempt->status === TestAttempt::STATUS_SUBMITTED) {
            return ['success' => false, 'error' => 'This attempt has already been submitted.'];
        }

        // Check if expired
        if ($attempt->isExpired()) {
            $this->expireAttempt($attemptId);
            return ['success' => false, 'error' => 'This attempt has expired.'];
        }

        $totalScore = 0;
        $maxScore = 0;
        $results = [];

        // Grade each answer
        foreach ($attempt->test->questions as $question) {
            $questionId = $question->id;
            $answer = $answers[$questionId] ?? null;
            $questionData = $question->toArray();

            $isCorrect = $this->scoringFactory->isCorrect(
                $question->type,
                $questionData,
                $answer
            );

            $score = $this->scoringFactory->calculateScore(
                $question->type,
                $questionData,
                $answer
            );

            // Save answer
            $this->testRepository->createAnswer($attemptId, $questionId, $answer, $isCorrect);

            // Calculate scores
            $questionMaxScore = $question->pivot->score ?? 1;
            $maxScore += $questionMaxScore;
            $totalScore += $isCorrect ? $questionMaxScore : 0;

            $results[] = [
                'question_id' => $questionId,
                'is_correct' => $isCorrect,
                'score' => $score,
                'max_score' => $questionMaxScore,
            ];
        }

        // Update attempt
        $percentageScore = $maxScore > 0 ? ($totalScore / $maxScore) * 100 : 0;

        $this->testRepository->updateAttempt($attemptId, [
            'status' => TestAttempt::STATUS_SUBMITTED,
            'submitted_at' => now(),
            'score' => $percentageScore,
        ]);

        return [
            'success' => true,
            'attempt_id' => $attemptId,
            'score' => round($percentageScore, 2),
            'total_correct' => collect($results)->where('is_correct', true)->count(),
            'total_questions' => count($results),
            'results' => $results,
        ];
    }

    public function getAllAttemptsForTest(int $testId): Collection
    {
        return $this->testRepository->getAttemptsByTestId($testId);
    }

    public function getResults(int $attemptId): array
    {
        $attempt = TestAttempt::with([
            'test.subject',
            'answers.question'
        ])->findOrFail($attemptId);

        return [
            'attempt_id' => $attempt->id,
            'test_id' => $attempt->test_id,
            'test_title' => $attempt->test->title,
            'subject' => $attempt->test->subject->name ?? null,
            'status' => $attempt->status,
            'score' => $attempt->score,
            'started_at' => $attempt->started_at,
            'submitted_at' => $attempt->submitted_at,
            'attempt_no' => $attempt->attempt_no,
            'total_questions' => $attempt->answers->count(),
            'correct_count' => $attempt->answers->where('is_correct', true)->count(),
        ];
    }

    public function getReview(int $attemptId): array
    {
        $attempt = TestAttempt::with([
            'test.subject',
            'answers.question'
        ])->findOrFail($attemptId);

        // Only allow review for submitted attempts
        if ($attempt->status !== TestAttempt::STATUS_SUBMITTED) {
            return ['success' => false, 'error' => 'Cannot review this attempt yet.'];
        }

        $questions = [];
        foreach ($attempt->test->questions as $question) {
            $answer = $attempt->answers->firstWhere('question_id', $question->id);
            $questionData = $question->toArray();

            $questions[] = [
                'id' => $question->id,
                'type' => $question->type,
                'content' => $question->content,
                'data' => $questionData['data'],
                'media_image' => $question->media_image,
                'media_audio' => $question->media_audio,
                'explanation' => $question->explanation,
                'user_answer' => $answer?->answer,
                'is_correct' => $answer?->is_correct,
                'correct_answer' => $this->scoringFactory->getCorrectAnswer($question->type, $questionData),
                'score' => $question->pivot->score ?? 1,
            ];
        }

        return [
            'attempt_id' => $attempt->id,
            'test_id' => $attempt->test_id,
            'test_title' => $attempt->test->title,
            'subject' => $attempt->test->subject->name ?? null,
            'score' => $attempt->score,
            'started_at' => $attempt->started_at,
            'submitted_at' => $attempt->submitted_at,
            'questions' => $questions,
        ];
    }

    public function getMyAttempts(int $userId): array
    {
        $attempts = $this->testRepository->getAttempts($userId);

        return $attempts->map(function ($attempt) {
            return [
                'attempt_id' => $attempt->id,
                'test_id' => $attempt->test_id,
                'test_title' => $attempt->test->title ?? 'Unknown',
                'subject' => $attempt->test->subject->name ?? null,
                'status' => $attempt->status,
                'score' => $attempt->score,
                'started_at' => $attempt->started_at,
                'submitted_at' => $attempt->submitted_at,
                'attempt_no' => $attempt->attempt_no,
            ];
        })->toArray();
    }

    public function expireAttempt(int $attemptId): void
    {
        $this->testRepository->updateAttempt($attemptId, [
            'status' => TestAttempt::STATUS_EXPIRED,
            'submitted_at' => now(),
        ]);
    }

    private function formatAttemptResponse(TestAttempt $attempt): array
    {
        $test = $this->testRepository->getTestWithQuestions($attempt->test_id);

        // Get existing answers for resume
        $existingAnswers = TestAnswer::where('attempt_id', $attempt->id)
            ->pluck('answer', 'question_id')
            ->toArray();

        $questions = $test->questions->map(function ($question) {
            return [
                'id' => $question->id,
                'type' => $question->type,
                'content' => $question->content,
                'data' => $question->data,
                'media_image' => $question->media_image,
                'media_audio' => $question->media_audio,
                'score' => $question->score ?? 1,
                'order_index' => $question->order_index,
            ];
        });

        return [
            'success' => true,
            'attempt_id' => $attempt->id,
            'test_id' => $attempt->test_id,
            'test_title' => $test->title,
            'duration' => $test->duration,
            'started_at' => $attempt->started_at,
            'expired_at' => $attempt->expired_at,
            'remaining_time' => $attempt->expired_at
                ? max(0, $attempt->expired_at->diffInSeconds(now(), false) * -1)
                : null,
            'questions' => $questions,
            'existing_answers' => $existingAnswers,
        ];
    }
}
