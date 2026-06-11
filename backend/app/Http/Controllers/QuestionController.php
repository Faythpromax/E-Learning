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

    // System Questions (Admin)
    public function indexSystem(Request $request): JsonResponse
    {
        $filters = $request->only(['subject_id', 'type', 'per_page']);
        $filters['scope'] = 'system';
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

    public function storeSystem(CreateQuestionRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['scope'] = 'system';
            $question = $this->questionService->createQuestion($data, $request->user()->id);
            return response()->json([
                'success' => true,
                'message' => 'Tạo câu hỏi hệ thống thành công',
                'data' => $question,
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function updateSystem(UpdateQuestionRequest $request, int $id): JsonResponse
    {
        try {
            $question = $this->questionService->getQuestion($id);
            if ($question->scope !== 'system') {
                return response()->json([
                    'success' => false,
                    'message' => 'Không thể cập nhật câu hỏi không thuộc hệ thống',
                ], 403);
            }
            $question = $this->questionService->updateQuestion($id, $request->validated());
            return response()->json([
                'success' => true,
                'message' => 'Cập nhật câu hỏi hệ thống thành công',
                'data' => $question,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function destroySystem(int $id): JsonResponse
    {
        $question = $this->questionService->getQuestion($id);
        if ($question->scope !== 'system') {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa câu hỏi không thuộc hệ thống',
            ], 403);
        }
        $this->questionService->deleteQuestion($id);
        return response()->json([
            'success' => true,
            'message' => 'Xoá câu hỏi hệ thống thành công',
        ]);
    }

    // Class Questions (Teacher + Admin)
    public function indexClass(Request $request): JsonResponse
    {
        $filters = $request->only(['subject_id', 'type', 'per_page']);
        $filters['scope'] = 'class';
        $filters['created_by'] = $request->user()->id;
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

    public function storeClass(CreateQuestionRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['scope'] = 'class';
            $question = $this->questionService->createQuestion($data, $request->user()->id);
            return response()->json([
                'success' => true,
                'message' => 'Tạo câu hỏi lớp học thành công',
                'data' => $question,
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function updateClass(UpdateQuestionRequest $request, int $id): JsonResponse
    {
        try {
            $question = $this->questionService->getQuestion($id);
            // Teacher can only update their own class questions
            if ($question->scope === 'class' && $question->created_by !== $request->user()->id && $request->user()->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Không có quyền cập nhật câu hỏi này',
                ], 403);
            }
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

    public function destroyClass(int $id): JsonResponse
    {
        $question = $this->questionService->getQuestion($id);
        // Teacher can only delete their own class questions
        if ($question->scope === 'class' && $question->created_by !== auth()->id() && auth()->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Không có quyền xóa câu hỏi này',
            ], 403);
        }
        $this->questionService->deleteQuestion($id);
        return response()->json([
            'success' => true,
            'message' => 'Xoá câu hỏi thành công',
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

    public function checkAnswer(Request $request, int $id): JsonResponse
    {
        $result = $this->questionService->checkAnswer($id, $request->input('answer'));
        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }
}
