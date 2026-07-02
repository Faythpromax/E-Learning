<?php

namespace App\Http\Controllers;

use App\Http\Requests\Test\StoreTestRequest;
use App\Http\Requests\Test\UpdateTestRequest;
use App\Http\Requests\Test\SubmitTestRequest;
use App\Services\TestService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestController extends Controller
{
    public function __construct(
        private readonly TestService $testService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $filters = [];

        if ($request->has('subject_id')) {
            $filters['subject_id'] = $request->input('subject_id');
        }

        if ($request->has('is_active')) {
            $filters['is_active'] = $request->boolean('is_active');
        }

        $user = $request->user();

        if ($user->role === 'admin') {
            $filters['scope'] = 'system';
        }
        
        if ($user->role === 'teacher') {
            $filters['scope'] = 'class';
            $filters['created_by'] = $user->id;
        }

        $tests = $this->testService->getAllTests(
            $filters,
            $user
        );

        return response()->json([
            'success' => true,
            'data' => $tests,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        try {
            $test = $this->testService->getTestWithQuestions($id);
            $test->load(['subject', 'classes',]);
            $test->attempts_count = $test->attempts()->count();

            return response()->json([
                'success' => true,
                'data' => $test,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Test not found.',
            ], 404);
        }
    }

    public function store(StoreTestRequest $request): JsonResponse
    {
        $user = $request->user();

        \Log::info('STORE TEST', $request->validated());

        // Only teachers and admins can create tests
        if (!in_array($user->role, ['teacher', 'admin'])) {
            return response()->json([
                'success' => false,
                'error' => 'You do not have permission to create tests.',
            ], 403);
        }

        $test = $this->testService->createTest($user->id, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Test created successfully.',
            'data' => $test,
        ], 201);
    }

    public function update(UpdateTestRequest $request, int $id): JsonResponse
    {
        $user = $request->user();

        try {
            $test = $this->testService->getTestById($id);

            // Only creator or admin can update
            if ($test->created_by !== $user->id && $user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'error' => 'You do not have permission to update this test.',
                ], 403);
            }

            $updatedTest = $this->testService->updateTest($id, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Test updated successfully.',
                'data' => $updatedTest,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Test not found.',
            ], 404);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        try {
            $test = $this->testService->getTestById($id);

            // Only creator or admin can delete
            if ($test->created_by !== $user->id && $user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'error' => 'You do not have permission to delete this test.',
                ], 403);
            }

            $this->testService->deleteTest($id);

            return response()->json([
                'success' => true,
                'message' => 'Test deleted successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Test not found.',
            ], 404);
        }
    }

    public function start(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $result = $this->testService->startTest($user->id, $id);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'error' => $result['error'],
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    public function submit(SubmitTestRequest $request, int $id): JsonResponse
    {
        $user = $request->user();
        $attemptId = $request->input('attempt_id');
        $answers = $request->input('answers', []);

        $result = $this->testService->submitTest($attemptId, $answers);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'error' => $result['error'],
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    public function allAttempts(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        try {
            $test = $this->testService->getTestById($id);

            // Only creator or admin can view all attempts
            if ($test->created_by !== $user->id && $user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'error' => 'You do not have permission to view attempts for this test.',
                ], 403);
            }

            $attempts = $this->testService->getAllAttemptsForTest($id);

            return response()->json([
                'success' => true,
                'data' => $attempts,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Test not found.',
            ], 404);
        }
    }

    public function myAttempts(Request $request): JsonResponse
    {
        $user = $request->user();

        $attempts = $this->testService->getMyAttempts($user->id);

        return response()->json([
            'success' => true,
            'data' => $attempts,
        ]);
    }

    public function results(int $attemptId): JsonResponse
    {
        try {
            $results = $this->testService->getResults($attemptId);

            return response()->json([
                'success' => true,
                'data' => $results,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Attempt not found.',
            ], 404);
        }
    }

    public function review(int $attemptId): JsonResponse
    {
        try {

            $review = $this->testService->getReview($attemptId);

            return response()->json([
                'success'=>true,
                'data'=>$review
            ]);

        } catch (\Exception $e) {
            \Log::error('FAILED GET REVIEW', ['exception' => $e]);

            return response()->json([
                'success' => false,
                'error' => 'Attempt not found. Error: ' . $e->getMessage(),
            ], 404);
        }
    }

    public function accessByCode(Request $request, string $code): JsonResponse
    {
        $test = $this->testService->getTestByCode($code);

        if (!$test) {
            return response()->json([
                'success' => false,
                'error' => 'Test not found with this code.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $test->id,
                'title' => $test->title,
                'subject' => $test->subject->name ?? null,
                'duration' => $test->duration,
                'question_count' => $test->questions->count(),
                'access_type' => $test->access_type,
            ],
        ]);
    }

    public function available(Request $request): JsonResponse
    {
        $user = $request->user();

        $tests = $this->testService->getAvailableTests($user->id);

        return response()->json([
            'success' => true,
            'data' => $tests,
        ]);
    }

    public function systemTests(Request $request): JsonResponse
    {
        $user = $request->user();

        $tests = $this->testService->getSystemTests();

        return response()->json([
            'success' => true,
            'data' => $tests,
        ]);
    }

    public function saveAnswer(Request $request)
    {
        $this->testService->saveAnswer(
            $request->attempt_id,
            $request->question_id,
            $request->answer
        );
        return response()->json([
            'success'=>true
        ]);
    }

    public function classScores(Request $request, int $classId, int $testId): JsonResponse
    {
        $user = $request->user();

        try {
            $test = $this->testService->getTestById($testId);
            if ($test->created_by !== $user->id && $user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'error' => 'You do not have permission to view scores for this test.',
                ], 403);
            }

            $data = $this->testService->getClassScores($classId, $testId);

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Test not found.',
            ], 404);
        }
    }
}
