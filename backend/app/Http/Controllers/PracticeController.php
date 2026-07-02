<?php

namespace App\Http\Controllers;

use App\Http\Requests\Practice\SubmitAnswerRequest;
use App\Models\ClassModel;
use App\Models\Practice;
use App\Notifications\AssignmentCreatedByTeacherNotification;
use App\Notifications\NewAssignmentForStudentNotification;
use App\Services\PracticeService;
use App\Events\NotificationCreated;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PracticeController extends Controller
{
    public function __construct(
        private readonly PracticeService $practiceService
    ) {}

    // Teacher endpoints
    public function index(): JsonResponse
    {
        $userId = auth()->id();

        $practices = Practice::where('created_by', $userId)
            ->with('subject:id,name')
            ->withCount('questions')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($practice) {
                $practice->attempts_count = 0;
                return $practice;
            });

        return response()->json([
            'success' => true,
            'data' => $practices,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $user = auth()->user();
        $practice = Practice::with('subject:id,name')
            ->withCount('questions')
            ->find($id);

        if (!$practice) {
            return response()->json([
                'success' => false,
                'message' => 'Practice not found.',
            ], 404);
        }

        if ($practice->created_by !== $user->id && $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to view this practice.',
            ], 403);
        }

        $practice->load(['subject:id,name', 'classes:id,name', 'questions.question:id,content,type,subject_id']);

        return response()->json([
            'success' => true,
            'data' => $practice,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subject_id' => 'required|exists:subjects,id',
            'class_ids' => 'nullable|array',
            'class_ids.*' => 'exists:classes,id',
            'description' => 'nullable|string',
            'question_ids' => 'nullable|array',
            'question_ids.*' => 'exists:questions,id',
        ]);

        $practice = Practice::create([
            'title' => $validated['title'],
            'subject_id' => $validated['subject_id'],
            'created_by' => auth()->id(),
            'description' => $validated['description'] ?? null,
            'is_active' => true,
        ]);

        if (!empty($validated['question_ids'])) {
            foreach ($validated['question_ids'] as $index => $questionId) {
                $practice->questions()->create([
                    'question_id' => $questionId,
                    'order_index' => $index,
                ]);
            }
        }

        if (!empty($validated['class_ids'])) {
            foreach ($validated['class_ids'] as $classId) {
                \App\Models\ClassPractice::create([
                    'class_id' => $classId,
                    'practice_id' => $practice->id,
                ]);
            }
        }

        $practice->load('subject:id,name');
        $practice->loadCount('questions');

        return response()->json([
            'success' => true,
            'message' => 'Practice created successfully.',
            'data' => $practice,
        ], 201);
    }

    public function destroy(int $id): JsonResponse
    {
        $user = auth()->user();
        $practice = Practice::find($id);

        if (!$practice) {
            return response()->json([
                'success' => false,
                'message' => 'Practice not found.',
            ], 404);
        }

        if ($practice->created_by !== $user->id && $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to delete this practice.',
            ], 403);
        }

        $practice->delete();

        return response()->json([
            'success' => true,
            'message' => 'Practice deleted successfully.',
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = auth()->user();
        $practice = Practice::find($id);

        if (!$practice) {
            return response()->json([
                'success' => false,
                'message' => 'Practice not found.',
            ], 404);
        }

        if ($practice->created_by !== $user->id && $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to update this practice.',
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'subject_id' => 'sometimes|nullable|exists:subjects,id',
            'description' => 'nullable|string',
            'question_ids' => 'nullable|array',
            'question_ids.*' => 'exists:questions,id',
            'class_ids' => 'nullable|array',
            'class_ids.*' => 'exists:classes,id',
        ]);

        $updateData = array_filter([
            'title' => $validated['title'] ?? null,
            'subject_id' => $validated['subject_id'] ?? null,
            'description' => $validated['description'] ?? null,
        ], fn($v) => $v !== null);

        if (!empty($updateData)) {
            $practice->update($updateData);
        }

        if (isset($validated['question_ids'])) {
            $practice->questions()->delete();
            foreach ($validated['question_ids'] as $index => $questionId) {
                $practice->questions()->create([
                    'question_id' => $questionId,
                    'order_index' => $index,
                ]);
            }
        }

        if (isset($validated['class_ids'])) {
            $practice->classes()->sync($validated['class_ids']);

            $practice->load(['creator', 'classes.students']);
            $assignmentName = $practice->title;
            $type = 'practice';

            foreach ($practice->classes as $class) {
                $teacher = $practice->creator;
                if ($teacher) {
                    $teacher->notify(new AssignmentCreatedByTeacherNotification(
                        $assignmentName,
                        $class->name,
                        $type
                    ));
                    event(new NotificationCreated($teacher->id));
                }

                foreach ($class->students as $student) {
                    $student->notify(new NewAssignmentForStudentNotification(
                        $assignmentName,
                        $teacher->name ?? 'Giáo viên',
                        $type
                    ));
                    event(new NotificationCreated($student->id));
                }
            }
        }

        $practice->load('subject:id,name');
        $practice->loadCount('questions');

        return response()->json([
            'success' => true,
            'message' => 'Practice updated successfully.',
            'data' => $practice,
        ]);
    }

    // Student endpoints
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

    public function getPracticeQuestions(int $id): JsonResponse
    {
        $practice = Practice::find($id);
        if (!$practice) {
            return response()->json(['success' => false, 'message' => 'Practice not found.'], 404);
        }

        $questions = $this->practiceService->getPracticeQuestions($id);

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

    public function getStudentPractices(): JsonResponse
    {
        $user = auth()->user();

        $classIds = \App\Models\ClassModel::whereHas('students', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })->pluck('id');

        $practices = Practice::whereHas('classes', function ($q) use ($classIds) {
            $q->whereIn('classes.id', $classIds);
        })
            ->with(['subject:id,name', 'classes:id,name', 'creator:id,name'])
            ->withCount('questions')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($practice) {
                $practice->class_name = $practice->classes->first()?->name;
                $practice->classes = null;
                return $practice;
            });

        return response()->json([
            'success' => true,
            'data' => $practices,
        ]);
    }
}
