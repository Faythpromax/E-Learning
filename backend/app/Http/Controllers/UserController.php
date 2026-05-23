<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(
        private readonly UserService $userService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['role', 'search', 'per_page']);
        $users = $this->userService->getUsers($filters);

        return response()->json([
            'success' => true,
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $user = $this->userService->getUser($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Khong tim thay nguoi dung',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $user,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $result = $this->userService->updateUser($id, $request->validated());

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Cap nhat thanh cong',
            'data' => $result['user'],
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $result = $this->userService->deleteUser($id);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Xoa nguoi dung thanh cong',
        ]);
    }

    public function teachers(): JsonResponse
    {
        $teachers = $this->userService->getTeachers();

        return response()->json([
            'success' => true,
            'data' => $teachers,
        ]);
    }

    public function students(): JsonResponse
    {
        $students = $this->userService->getStudents();

        return response()->json([
            'success' => true,
            'data' => $students,
        ]);
    }
}
