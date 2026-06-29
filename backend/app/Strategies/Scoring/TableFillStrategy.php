<?php

namespace App\Strategies\Scoring;

class TableFillStrategy implements ScoringStrategyInterface
{
    public function calculateScore(array $questionData, mixed $answer): float
    {
        $correctAnswers = $questionData['data']['correct_answers'] ?? [];

        if (!is_array($answer) || !is_array($correctAnswers)) {
            return 0.0;
        }

        $correctCount = 0;
        $totalCells = 0;

        $answerValues = array_values($answer);

        foreach ($correctAnswers as $rowIndex => $correct) {
            $totalCells++;
            $userAnswer = $answerValues[$rowIndex] ?? '';
            if (mb_strtolower(trim($userAnswer)) === mb_strtolower(trim($correct))) {
                $correctCount++;
            }
        }

        return $totalCells > 0 ? $correctCount / $totalCells : 0.0;
    }

    public function isCorrect(array $questionData, mixed $answer): bool
    {
        return $this->calculateScore($questionData, $answer) === 1.0;
    }

    public function getCorrectAnswer(array $questionData): mixed
    {
        return $questionData['data']['correct_answers'] ?? [];
    }
}
