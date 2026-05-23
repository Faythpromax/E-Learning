<?php

namespace App\Http\Controllers;

use App\Http\Requests\Question\CreateQuestionRequest;
use App\Http\Requests\Question\UpdateQuestionRequest;
use App\Services\QuestionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function __construct(
        private readonly QuestionService $questionService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['subject_id', 'type', 'per_page', 'created_by']);
        $questions = $this->questionService->getAllQuestions($filters);

        return response()->json([
            'success' => true,
            'data' => $questions->items(),
            'meta' => [
                'current_page' => $questions->currentPage(),
                'last_page' => $questions->lastPage(),
                'per_page' => $questions->perPage(),
                'total' => $questions->total(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        try {
            $question = $this->questionService->getQuestion($id);
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

    public function store(CreateQuestionRequest $request): JsonResponse
    {
        try {
            $question = $this->questionService->createQuestion(
                $request->validated(),
                $request->user()->id
            );
            return response()->json([
                'success' => true,
                'message' => 'Tạo câu hỏi thành công',
                'data' => $question,
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function update(UpdateQuestionRequest $request, int $id): JsonResponse
    {
        try {
            $question = $this->questionService->updateQuestion($id, $request->validated());
            return response()->json([
                'success' => true,
                'message' => 'Cập nhật câu hỏi thành công',
                'data' => $question,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        $this->questionService->deleteQuestion($id);
        return response()->json([
            'success' => true,
            'message' => 'Xoá câu hỏi thành công',
        ]);
    }

    public function checkAnswer(Request $request, int $id): JsonResponse
    {
        $result = $this->questionService->checkAnswer($id, $request->input('answer'));
        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }
}
