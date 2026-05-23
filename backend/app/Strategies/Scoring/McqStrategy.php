<?php

namespace App\Strategies\Scoring;

class McqStrategy implements ScoringStrategyInterface
{
    public function calculateScore(array $questionData, mixed $answer): float
    {
        return $this->isCorrect($questionData, $answer) ? 1.0 : 0.0;
    }

    public function isCorrect(array $questionData, mixed $answer): bool
    {
        $correctAnswer = $questionData['data']['correct_answer'] ?? null;
        return $correctAnswer !== null && $correctAnswer === $answer;
    }

    public function getCorrectAnswer(array $questionData): mixed
    {
        return $questionData['data']['correct_answer'] ?? null;
    }
}
