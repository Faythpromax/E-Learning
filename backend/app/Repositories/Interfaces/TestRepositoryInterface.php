<?php

namespace App\Repositories\Interfaces;

interface TestRepositoryInterface
{
    public function getAll(array $filters = []);
    public function getById(int $id);
    public function getByCode(string $code);
    public function getQuestions(int $testId);
    public function getAttempts(int $userId, ?int $testId = null);
    public function getTestWithQuestions(int $id);
    public function getAvailableTestsForUser(int $userId);
    public function getActiveAttempt(int $userId, int $testId);
    public function createTest(array $data);
    public function updateTest(int $id, array $data);
    public function deleteTest(int $id);
    public function createAttempt(int $userId, int $testId);
    public function updateAttempt(int $attemptId, array $data);
    public function createAnswer(int $attemptId, int $questionId, mixed $answer, bool $isCorrect);
    public function getAttemptWithAnswers(int $attemptId);
}
