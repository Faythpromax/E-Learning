<?php

namespace App\Services;

use App\Models\Question;
use App\Repositories\QuestionRepository;
use App\Strategies\Scoring\ScoringStrategyFactory;
use Illuminate\Pagination\LengthAwarePaginator;

class QuestionService
{
    public function __construct(
        private readonly QuestionRepository $questionRepository,
        private readonly ScoringStrategyFactory $scoringFactory
    ) {}

    public function getAllQuestions(array $filters = []): LengthAwarePaginator
    {
        return $this->questionRepository->getAll($filters);
    }

    public function getQuestion(int $id): Question
    {
        return $this->questionRepository->getById($id);
    }

    public function createQuestion(array $data, int $creatorId): Question
    {
        $data['created_by'] = $creatorId;
        $this->validateQuestionData($data['type'], $data['data'] ?? []);

        return $this->questionRepository->create($data);
    }

    public function updateQuestion(int $id, array $data): Question
    {
        $question = $this->getQuestion($id);
        
        if (isset($data['type']) || isset($data['data'])) {
            $type = $data['type'] ?? $question->type;
            $questionData = $data['data'] ?? $question->data;
            $this->validateQuestionData($type, $questionData);
        }

        return $this->questionRepository->update($id, $data);
    }

    public function deleteQuestion(int $id): bool
    {
        return $this->questionRepository->delete($id);
    }

    public function getQuestionsBySubject(int $subjectId): \Illuminate\Database\Eloquent\Collection
    {
        return $this->questionRepository->getBySubject($subjectId);
    }

    public function getQuestionsByCreator(int $userId): \Illuminate\Database\Eloquent\Collection
    {
        return $this->questionRepository->getByCreator($userId);
    }

    public function checkAnswer(int $questionId, mixed $answer): array
    {
        $question = $this->getQuestion($questionId);
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

        return [
            'is_correct' => $isCorrect,
            'score' => $score,
            'correct_answer' => $this->scoringFactory->getCorrectAnswer($question->type, $questionArray),
        ];
    }

    public function calculateScore(string $type, array $questionData, mixed $answer): float
    {
        return $this->scoringFactory->calculateScore($type, $questionData, $answer);
    }

    private function validateQuestionData(string $type, array $data): void
    {
        $validator = match ($type) {
            'mcq' => $this->validateMcq($data),
            'fill_blank' => $this->validateFillBlank($data),
            'matching' => $this->validateMatching($data),
            'table_fill' => $this->validateTableFill($data),
            default => 'Loại câu hỏi không hợp lệ. Chỉ chấp nhận: mcq, fill_blank, matching, table_fill'
        };

        if ($validator !== true) {
            throw new \InvalidArgumentException($validator);
        }
    }

    private function validateMcq(array $data): bool|string
    {
        if (empty($data['options']) || !is_array($data['options'])) {
            return 'MCQ yêu cầu mảng options';
        }
        if (empty($data['correct_answer'])) {
            return 'MCQ yêu cầu correct_answer';
        }
        return true;
    }

    private function validateFillBlank(array $data): bool|string
    {
        if (empty($data['correct_answers']) || !is_array($data['correct_answers'])) {
            return 'FillBlank yêu cầu mảng correct_answers';
        }
        return true;
    }

    private function validateMatching(array $data): bool|string
    {
        if (empty($data['left']) || !is_array($data['left'])) {
            return 'Matching yêu cầu mảng left';
        }
        if (empty($data['right']) || !is_array($data['right'])) {
            return 'Matching yêu cầu mảng right';
        }
        if (empty($data['correct_matches']) || !is_array($data['correct_matches'])) {
            return 'Matching yêu cầu correct_matches';
        }
        return true;
    }

    private function validateTableFill(array $data): bool|string
    {
        if (empty($data['rows']) || !is_array($data['rows'])) {
            return 'TableFill yêu cầu mảng rows';
        }
        if (empty($data['cols']) || !is_int($data['cols']) && !is_numeric($data['cols'])) {
            return 'TableFill yêu cầu cols';
        }
        return true;
    }
}
