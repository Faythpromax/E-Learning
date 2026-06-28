<?php

namespace App\Services;

use App\Models\Question;
use App\Models\QuestionProgress;
use App\Repositories\QuestionRepository;
use App\Strategies\ScoringFactory;

class PracticeService
{
    public function __construct(
        private readonly QuestionRepository $questionRepository,
        private readonly ScoringFactory $scoringFactory
    ) {}

    public function getQuestion(int $questionId): Question
    {
        return $this->questionRepository->getById($questionId);
    }

    public function getRandomQuestions(int $limit = 10, ?int $subjectId = null)
    {
        return $this->questionRepository->getRandomQuestions($limit, $subjectId);
    }

    public function getPracticeQuestions(int $practiceId): \Illuminate\Database\Eloquent\Collection
    {
        return $this->questionRepository->getByPracticeId($practiceId);
    }

    public function submitAnswer(int $userId, int $questionId, mixed $answer): array
    {
        $question = $this->questionRepository->getById($questionId);
        $questionArray = $question->toArray();

        $isCorrect = $this->scoringFactory->isCorrect(
            $question->type,
            $questionArray,
            $answer
        );

        $score = $this->scoringFactory->calculateScore(
            $question->type,
            $questionArray,
            $answer
        );

        $this->updateProgress($userId, $questionId, $isCorrect, $answer);

        return [
            'is_correct' => $isCorrect,
            'score' => $score,
            'correct_answer' => $this->scoringFactory->getCorrectAnswer($question->type, $questionArray),
            'explanation' => $question->explanation,
            'question_type' => $question->type,
        ];
    }

    public function getProgress(int $userId): array
    {
        $progress = QuestionProgress::where('user_id', $userId)
            ->with('question:id,content,type,subject_id')
            ->orderBy('last_attempt_at', 'desc')
            ->limit(20)
            ->get();

        $stats = [
            'total_attempts' => $progress->count(),
            'correct_count' => $progress->where('is_correct', true)->count(),
            'accuracy' => $progress->count() > 0
                ? round($progress->where('is_correct', true)->count() / $progress->count() * 100, 1)
                : 0,
        ];

        return [
            'recent' => $progress,
            'stats' => $stats,
        ];
    }

    private function updateProgress(int $userId, int $questionId, bool $isCorrect, mixed $answer): void
    {
        $progress = QuestionProgress::where('user_id', $userId)
            ->where('question_id', $questionId)
            ->first();

        if ($progress) {
            $progress->update([
                'is_correct' => $isCorrect,
                'last_answer' => $answer,
                'attempt_count' => $progress->attempt_count + 1,
                'last_attempt_at' => now(),
            ]);
        } else {
            QuestionProgress::create([
                'user_id' => $userId,
                'question_id' => $questionId,
                'is_correct' => $isCorrect,
                'last_answer' => $answer,
                'attempt_count' => 1,
                'last_attempt_at' => now(),
            ]);
        }
    }
}
