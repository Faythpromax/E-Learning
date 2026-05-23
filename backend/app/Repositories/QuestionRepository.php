<?php

namespace App\Repositories;

use App\Models\Question;
use App\Repositories\Interfaces\QuestionRepositoryInterface;

class QuestionRepository implements QuestionRepositoryInterface
{
    public function getById(int $id): Question
    {
        return Question::with(['subject', 'creator'])->findOrFail($id);
    }

    public function getRandomQuestions(int $limit = 10, ?int $subjectId = null)
    {
        $query = Question::with(['subject']);

        if ($subjectId) {
            $query->where('subject_id', $subjectId);
        }

        return $query->inRandomOrder()->limit($limit)->get();
    }

    public function getBySubject(int $subjectId)
    {
        return Question::where('subject_id', $subjectId)->get();
    }
}
