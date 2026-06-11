<?php

namespace App\Repositories;

use App\Models\Test;
use App\Models\TestAttempt;
use App\Models\TestAnswer;
use App\Models\TestQuestion;
use App\Models\ClassModel;
use App\Models\ClassUser;
use App\Repositories\Interfaces\TestRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;

class TestRepository implements TestRepositoryInterface
{
    public function getAll(array $filters = []): Collection
    {
        $query = Test::with(['subject', 'creator', 'questions']);

        if (isset($filters['subject_id'])) {
            $query->where('subject_id', $filters['subject_id']);
        }

        if (isset($filters['created_by'])) {
            $query->where('created_by', $filters['created_by']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function getById(int $id): Model
    {
        return Test::with(['subject', 'creator', 'questions'])->findOrFail($id);
    }

    public function getByCode(string $code): ?Model
    {
        return Test::with(['subject', 'creator'])
            ->where('test_code', $code)
            ->where('is_active', true)
            ->first();
    }

    public function getQuestions(int $testId): Collection
    {
        return TestQuestion::where('test_id', $testId)
            ->with(['question'])
            ->orderBy('order_index')
            ->get();
    }

    public function getAttempts(int $userId, ?int $testId = null): Collection
    {
        $query = TestAttempt::where('user_id', $userId)
            ->with(['test', 'test.subject']);

        if ($testId) {
            $query->where('test_id', $testId);
        }

        return $query->orderBy('started_at', 'desc')->get();
    }

    public function getAttemptsByTestId(int $testId): Collection
    {
        return TestAttempt::where('test_id', $testId)
            ->with(['user', 'test.subject'])
            ->orderBy('submitted_at', 'desc')
            ->get();
    }

    public function getTestWithQuestions(int $id): Model
    {
        return Test::with([
            'subject',
            'creator',
            'questions'
        ])->findOrFail($id);
    }

    public function getAvailableTestsForUser(int $userId): Collection
    {
        $user = \App\Models\User::findOrFail($userId);

        $query = Test::with(['subject', 'creator', 'testQuestions'])
            ->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });

        // System tests are available to everyone
        $query->orWhere('scope', 'system');

        // Access type: public_code or both
        $query->orWhere(function ($q) {
            $q->where('access_type', 'public_code')
                ->orWhere('access_type', 'both');
        });

        // If user is in any classes, also get class_only tests from those classes
        $classIds = ClassUser::where('user_id', $userId)->pluck('class_id');

        if ($classIds->isNotEmpty()) {
            $query->orWhere(function ($q) use ($classIds) {
                $q->where('access_type', 'class_only')
                    ->orWhere('access_type', 'both');
            });
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function getSystemTests(): Collection
    {
        return Test::with(['subject', 'creator', 'testQuestions'])
            ->where('scope', 'system')
            ->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getActiveAttempt(int $userId, int $testId): ?Model
    {
        return TestAttempt::where('user_id', $userId)
            ->where('test_id', $testId)
            ->where('status', TestAttempt::STATUS_IN_PROGRESS)
            ->where(function ($q) {
                $q->whereNull('expired_at')
                    ->orWhere('expired_at', '>', now());
            })
            ->first();
    }

    public function createTest(array $data): Model
    {
        // Generate unique test code
        if (!isset($data['test_code'])) {
            $data['test_code'] = $this->generateTestCode();
        }

        $test = Test::create($data);

        // Attach questions if provided
        if (isset($data['question_ids']) && is_array($data['question_ids'])) {
            $questions = [];
            foreach ($data['question_ids'] as $index => $questionId) {
                $questions[$questionId] = [
                    'order_index' => $index + 1,
                    'score' => $data['question_scores'][$questionId] ?? 1,
                ];
            }
            $test->questions()->attach($questions);
        }

        return $test->load(['subject', 'creator', 'questions']);
    }

    public function updateTest(int $id, array $data): Model
    {
        $test = Test::findOrFail($id);
        $test->update($data);

        // Update questions if provided
        if (isset($data['question_ids']) && is_array($data['question_ids'])) {
            $questions = [];
            foreach ($data['question_ids'] as $index => $questionId) {
                $questions[$questionId] = [
                    'order_index' => $index + 1,
                    'score' => $data['question_scores'][$questionId] ?? 1,
                ];
            }
            $test->questions()->sync($questions);
        }

        return $test->load(['subject', 'creator', 'questions']);
    }

    public function deleteTest(int $id): bool
    {
        $test = Test::findOrFail($id);
        return $test->delete();
    }

    public function createAttempt(int $userId, int $testId): Model
    {
        $test = Test::findOrFail($testId);
        
        // Count existing attempts
        $attemptNo = TestAttempt::where('user_id', $userId)
            ->where('test_id', $testId)
            ->max('attempt_no') + 1;

        // Calculate expiration time
        $expiredAt = null;
        if ($test->duration) {
            $expiredAt = now()->addMinutes($test->duration);
        }

        return TestAttempt::create([
            'user_id' => $userId,
            'test_id' => $testId,
            'attempt_no' => $attemptNo,
            'started_at' => now(),
            'expired_at' => $expiredAt,
            'status' => TestAttempt::STATUS_IN_PROGRESS,
        ]);
    }

    public function updateAttempt(int $attemptId, array $data): Model
    {
        $attempt = TestAttempt::findOrFail($attemptId);
        $attempt->update($data);
        return $attempt;
    }

    public function createAnswer(int $attemptId, int $questionId, mixed $answer, bool $isCorrect): Model
    {
        return TestAnswer::updateOrCreate(
            [
                'attempt_id' => $attemptId,
                'question_id' => $questionId,
            ],
            [
                'answer' => $answer,
                'is_correct' => $isCorrect,
            ]
        );
    }

    public function getAttemptWithAnswers(int $attemptId): Model
    {
        return TestAttempt::with([
            'test',
            'test.subject',
            'test.questions.question',
            'answers.question'
        ])->findOrFail($attemptId);
    }

    private function generateTestCode(): string
    {
        do {
            $code = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 8));
        } while (Test::where('test_code', $code)->exists());

        return $code;
    }
}
