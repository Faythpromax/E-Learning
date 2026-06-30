<?php

namespace App\Http\Controllers;

use App\Http\Requests\Class\StoreClassRequest;
use App\Http\Requests\Class\UpdateClassRequest;
use App\Http\Requests\Class\JoinClassRequest;
use App\Http\Requests\Class\AddMemberRequest;
use App\Http\Requests\Class\StoreMaterialRequest;
use App\Http\Requests\Class\AssignTestRequest;
use App\Http\Requests\Class\AssignPracticeRequest;
use App\Services\ClassService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClassController extends Controller
{
    public function __construct(
        private readonly ClassService $classService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $filters = $request->only(['search']);

        $classes = $this->classService->getAllClasses($filters, $user->id);

        return response()->json([
            'success' => true,
            'data' => $classes,
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        $classes = $this->classService->searchClasses((string) $request->query('q', ''));

        return response()->json([
            'success' => true,
            'data' => $classes,
        ]);
    }

    public function show(int $classId): JsonResponse
    {
        $class = $this->classService->getClassDetail($classId);

        if (!$class) {
            return response()->json([
                'success' => false,
                'message' => 'Lop khong ton tai.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $class,
        ]);
    }

    public function store(StoreClassRequest $request): JsonResponse
    {
        $user = $request->user();

        $class = $this->classService->createClass(
            $user->id,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Tao lop thanh cong.',
            'data' => $class,
        ], 201);
    }

    public function update(UpdateClassRequest $request, int $classId): JsonResponse
    {
        $user = $request->user();

        if (!$this->classService->canManageClass($user->id, $classId)) {
            return response()->json([
                'success' => false,
                'message' => 'Ban khong co quyen chinh sua lop nay.',
            ], 403);
        }

        try {
            $class = $this->classService->updateClass($classId, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Cap nhat lop thanh cong.',
                'data' => $class,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function destroy(Request $request, int $classId): JsonResponse
    {
        $user = $request->user();

        if (!$this->classService->canManageClass($user->id, $classId)) {
            return response()->json([
                'success' => false,
                'message' => 'Ban khong co quyen xoa lop nay.',
            ], 403);
        }

        $this->classService->deleteClass($classId);

        return response()->json([
            'success' => true,
            'message' => 'Xoa lop thanh cong.',
        ]);
    }

    public function join(JoinClassRequest $request): JsonResponse
    {
        $user = $request->user();

        $result = $this->classService->joinClass(
            $user->id,
            $request->input('class_code')
        );

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => $result['message'],
            'data' => $result['class'],
        ]);
    }

    public function leave(Request $request, int $classId): JsonResponse
    {
        $user = $request->user();

        $result = $this->classService->leaveClass($user->id, $classId);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => $result['message'],
        ]);
    }

    public function students(int $classId): JsonResponse
    {
        $students = $this->classService->getStudents($classId);

        return response()->json([
            'success' => true,
            'data' => $students,
        ]);
    }

    public function addStudent(AddMemberRequest $request, int $classId): JsonResponse
    {
        $user = $request->user();

        if (!$this->classService->canManageClass($user->id, $classId)) {
            return response()->json([
                'success' => false,
                'message' => 'Ban khong co quyen them hoc sinh.',
            ], 403);
        }

        $result = $this->classService->addStudent($classId, $request->input('user_id'));

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => $result['message'],
        ]);
    }

    public function removeStudent(Request $request, int $classId, int $userId): JsonResponse
    {
        $user = $request->user();

        if (!$this->classService->canManageClass($user->id, $classId)) {
            return response()->json([
                'success' => false,
                'message' => 'Ban khong co quyen xoa hoc sinh.',
            ], 403);
        }

        $result = $this->classService->removeStudent($classId, $userId);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => $result['message'],
        ]);
    }

    public function teachers(int $classId): JsonResponse
    {
        $teachers = $this->classService->getTeachers($classId);

        return response()->json([
            'success' => true,
            'data' => $teachers,
        ]);
    }

    public function addTeacher(AddMemberRequest $request, int $classId): JsonResponse
    {
        $user = $request->user();

        if (!$this->classService->canManageClass($user->id, $classId)) {
            return response()->json([
                'success' => false,
                'message' => 'Ban khong co quyen them giao vien.',
            ], 403);
        }

        $result = $this->classService->addTeacher($classId, $request->input('user_id'));

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => $result['message'],
        ]);
    }

    public function removeTeacher(Request $request, int $classId, int $userId): JsonResponse
    {
        $user = $request->user();

        if (!$this->classService->canManageClass($user->id, $classId)) {
            return response()->json([
                'success' => false,
                'message' => 'Ban khong co quyen xoa giao vien.',
            ], 403);
        }

        $result = $this->classService->removeTeacher($classId, $userId);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => $result['message'],
        ]);
    }

    public function materials(int $classId): JsonResponse
    {
        $materials = $this->classService->getMaterials($classId);

        return response()->json([
            'success' => true,
            'data' => $materials,
        ]);
    }

    public function storeMaterial(StoreMaterialRequest $request, int $classId): JsonResponse
    {
        $user = $request->user();

        if (!$this->classService->canManageClass($user->id, $classId)) {
            return response()->json([
                'success' => false,
                'message' => 'Ban khong co quyen them tai lieu.',
            ], 403);
        }

        $material = $this->classService->addMaterial($classId, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Them tai lieu thanh cong.',
            'data' => $material,
        ], 201);
    }

    public function removeMaterial(Request $request, int $classId, int $materialId): JsonResponse
    {
        $user = $request->user();

        if (!$this->classService->canManageClass($user->id, $classId)) {
            return response()->json([
                'success' => false,
                'message' => 'Ban khong co quyen xoa tai lieu.',
            ], 403);
        }

        $this->classService->removeMaterial($classId, $materialId);

        return response()->json([
            'success' => true,
            'message' => 'Xoa tai lieu thanh cong.',
        ]);
    }

    public function tests(int $classId): JsonResponse
    {
        $tests = $this->classService->getTests($classId);

        return response()->json([
            'success' => true,
            'data' => $tests,
        ]);
    }

    public function assignTest(AssignTestRequest $request, int $classId): JsonResponse
    {
        $user = $request->user();

        if (!$this->classService->canManageClass($user->id, $classId)) {
            return response()->json([
                'success' => false,
                'message' => 'Ban khong co quyen gan bai kiem tra.',
            ], 403);
        }

        $result = $this->classService->assignTest($classId, $request->input('test_id'));

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => $result['message'],
        ]);
    }

    public function removeTest(Request $request, int $classId, int $testId): JsonResponse
    {
        $user = $request->user();

        if (!$this->classService->canManageClass($user->id, $classId)) {
            return response()->json([
                'success' => false,
                'message' => 'Ban khong co quyen xoa bai kiem tra.',
            ], 403);
        }

        $this->classService->removeTest($classId, $testId);

        return response()->json([
            'success' => true,
            'message' => 'Xoa bai kiem tra thanh cong.',
        ]);
    }

    public function practices(int $classId): JsonResponse
    {
        $practices = $this->classService->getPractices($classId);

        return response()->json([
            'success' => true,
            'data' => $practices,
        ]);
    }

    public function assignPractice(AssignPracticeRequest $request, int $classId): JsonResponse
    {
        $user = $request->user();

        if (!$this->classService->canManageClass($user->id, $classId)) {
            return response()->json([
                'success' => false,
                'message' => 'Ban khong co quyen gan bai on tap.',
            ], 403);
        }

        $result = $this->classService->assignPractice($classId, $request->input('practice_id'));

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => $result['message'],
        ]);
    }

    public function removePractice(Request $request, int $classId, int $practiceId): JsonResponse
    {
        $user = $request->user();

        if (!$this->classService->canManageClass($user->id, $classId)) {
            return response()->json([
                'success' => false,
                'message' => 'Ban khong co quyen xoa bai on tap.',
            ], 403);
        }

        $this->classService->removePractice($classId, $practiceId);

        return response()->json([
            'success' => true,
            'message' => 'Xoa bai on tap thanh cong.',
        ]);
    }
}
