<?php

namespace App\Repositories;

use App\Models\Question;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class QuestionRepository
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Question::with(['subject']);

        if (!empty($filters['subject_id'])) {
            $query->where('subject_id', $filters['subject_id']);
        }

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        return $query->paginate(10);
    }

    public function getById(int $id): Question
    {
        return Question::findOrFail($id);
    }

    public function create(array $data): Question
    {
        return Question::create($data);
    }

    public function update(int $id, array $data): Question
    {
        $question = $this->getById($id);

        $question->update($data);

        return $question;
    }

    public function delete(int $id): bool
    {
        $question = $this->getById($id);

        return $question->delete();
    }

    public function getBySubject(int $subjectId): Collection
    {
        return Question::where('subject_id', $subjectId)->get();
    }

    public function getByCreator(int $userId): Collection
    {
        return Question::where('created_by', $userId)->get();
    }
}