<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\PracticeController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SubjectController;

// Provide a friendly JSON response for accidental GET requests to /api/login
// This prevents the default 405 HTML response when someone navigates to /api/login
Route::get('/login', function () {
    return response()->json([
        'message' => 'This endpoint accepts POST requests for authentication. Please POST credentials to /api/login.',
        'hint' => 'Use POST /api/login with {email, password, role}'
    ], 200);
});

Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'register']);
Route::get('/tests/attempts/{attemptId}/review', [TestController::class, 'review']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // System Questions (Admin only)
    Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
        Route::get('/admin/questions', [QuestionController::class, 'indexSystem']);
        Route::post('/admin/questions', [QuestionController::class, 'storeSystem']);
        Route::put('/admin/questions/{id}', [QuestionController::class, 'updateSystem']);
        Route::delete('/admin/questions/{id}', [QuestionController::class, 'destroySystem']);
    });

    // Class Questions (Teacher + Admin)
    Route::middleware(['auth:sanctum', 'role:teacher,admin'])->group(function () {
        Route::get('/teacher/questions', [QuestionController::class, 'indexClass']);
        Route::post('/teacher/questions', [QuestionController::class, 'storeClass']);
        Route::put('/teacher/questions/{id}', [QuestionController::class, 'updateClass']);
        Route::delete('/teacher/questions/{id}', [QuestionController::class, 'destroyClass']);
    });

    // Question details and check answer - All authenticated users
    Route::get('/questions/{id}', [QuestionController::class, 'show']);
    Route::post('/questions/{id}/check', [QuestionController::class, 'checkAnswer']);

    // Practice
    Route::get('/practice/questions/{id}', [PracticeController::class, 'getQuestion']);
    Route::get('/practice/questions/random', [PracticeController::class, 'getRandomQuestions']);
    Route::post('/practice/check', [PracticeController::class, 'submitAnswer']);
    Route::get('/practice/progress', [PracticeController::class, 'getProgress']);

    // Teacher Practice Management
    Route::middleware(['auth:sanctum', 'role:teacher,admin'])->group(function () {
        Route::get('/teacher/practices', [PracticeController::class, 'index']);
        Route::get('/teacher/practices/{id}', [PracticeController::class, 'show']);
        Route::post('/teacher/practices', [PracticeController::class, 'store']);
        Route::put('/teacher/practices/{id}', [PracticeController::class, 'update']);
        Route::delete('/teacher/practices/{id}', [PracticeController::class, 'destroy']);
    });
    Route::get('/subjects', [SubjectController::class, 'index']);

    // Tests
    Route::get('/tests', [TestController::class, 'index']);
    Route::get('/tests/available', [TestController::class, 'available']);
    Route::get('/tests/system', [TestController::class, 'systemTests']);
    Route::get('/tests/access/{code}', [TestController::class, 'accessByCode']);

    // Test Results
    Route::get('/tests/attempts', [TestController::class, 'myAttempts']);
    Route::get('/tests/attempts/{attemptId}', [TestController::class, 'results']);
    Route::get('/tests/attempts/{attemptId}/review', [TestController::class, 'review']);

    // Test Taking
    Route::get('/tests/{id}/attempts', [TestController::class, 'allAttempts']);
    Route::post('/tests/{id}/start', [TestController::class, 'start']);
    Route::post('/tests/{id}/submit', [TestController::class, 'submit']);

    Route::get('/tests/{id}', [TestController::class, 'show'])->whereNumber('id');
    Route::post('/tests', [TestController::class, 'store']);
    Route::put('/tests/{id}', [TestController::class, 'update'])->whereNumber('id');
    Route::delete('/tests/{id}', [TestController::class, 'destroy'])->whereNumber('id');

    // Classes
    Route::get('/classes', [ClassController::class, 'index']);
    Route::get('/classes/search', [ClassController::class, 'search']);
    Route::get('/classes/{class}', [ClassController::class, 'show']);
    Route::post('/classes', [ClassController::class, 'store']);
    Route::put('/classes/{class}', [ClassController::class, 'update']);
    Route::delete('/classes/{class}', [ClassController::class, 'destroy']);

    // Join/Leave Class
    Route::post('/classes/join', [ClassController::class, 'join']);
    Route::post('/classes/{class}/leave', [ClassController::class, 'leave']);

    // Class Students
    Route::get('/classes/{class}/students', [ClassController::class, 'students']);
    Route::post('/classes/{class}/students', [ClassController::class, 'addStudent']);
    Route::delete('/classes/{class}/students/{user}', [ClassController::class, 'removeStudent']);

    // Class Teachers
    Route::get('/classes/{class}/teachers', [ClassController::class, 'teachers']);
    Route::post('/classes/{class}/teachers', [ClassController::class, 'addTeacher']);
    Route::delete('/classes/{class}/teachers/{user}', [ClassController::class, 'removeTeacher']);

    // Class Materials
    Route::get('/classes/{class}/materials', [ClassController::class, 'materials']);
    Route::post('/classes/{class}/materials', [ClassController::class, 'storeMaterial']);
    Route::delete('/classes/{class}/materials/{material}', [ClassController::class, 'removeMaterial']);

    // Class Tests
    Route::get('/classes/{class}/tests', [ClassController::class, 'tests']);
    Route::post('/classes/{class}/tests', [ClassController::class, 'assignTest']);
    Route::delete('/classes/{class}/tests/{test}', [ClassController::class, 'removeTest']);

    // Users (Admin only)
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/teachers', [UserController::class, 'teachers']);
    Route::get('/users/students', [UserController::class, 'students']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});
