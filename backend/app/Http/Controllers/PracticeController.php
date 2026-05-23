<?php

namespace App\Http\Controllers;

use App\Http\Requests\Practice\SubmitAnswerRequest;
use App\Services\PracticeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PracticeController extends Controller
{
    public function __construct(
        private readonly PracticeService $practiceService
    ) {}

    public function getQuestion(int $id): JsonResponse
    {
        try {
            $question = $this->practiceService->getQuestion($id);
            return response()->json([
                'success' => true,
                'data' => $question,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy câu hỏi',
            ], 404);
        }
    }

    public function getRandomQuestions(Request $request): JsonResponse
    {
        $limit = $request->input('limit', 10);
        $subjectId = $request->input('subject_id');

        $questions = $this->practiceService->getRandomQuestions($limit, $subjectId);

        return response()->json([
            'success' => true,
            'data' => $questions,
        ]);
    }

    public function submitAnswer(SubmitAnswerRequest $request): JsonResponse
    {
        $result = $this->practiceService->submitAnswer(
            $request->user()->id,
            $request->input('question_id'),
            $request->input('answer')
        );

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    public function getProgress(): JsonResponse
    {
        $progress = $this->practiceService->getProgress(auth()->id());

        return response()->json([
            'success' => true,
            'data' => $progress,
        ]);
    }
}
