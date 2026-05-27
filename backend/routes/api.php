<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\PracticeController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Questions
    Route::get('/questions', [QuestionController::class, 'index']);
    Route::get('/questions/{id}', [QuestionController::class, 'show']);
    Route::post('/questions', [QuestionController::class, 'store']);
    Route::put('/questions/{id}', [QuestionController::class, 'update']);
    Route::delete('/questions/{id}', [QuestionController::class, 'destroy']);
    Route::post('/questions/{id}/check', [QuestionController::class, 'checkAnswer']);

    // Practice
    Route::get('/practice/questions/{id}', [PracticeController::class, 'getQuestion']);
    Route::get('/practice/random', [PracticeController::class, 'getRandomQuestions']);
    Route::post('/practice/answer', [PracticeController::class, 'submitAnswer']);
    Route::get('/practice/progress', [PracticeController::class, 'getProgress']);

    // Tests
    Route::get('/tests', [TestController::class, 'index']);
    Route::get('/tests/available', [TestController::class, 'available']);
    Route::get('/tests/access/{code}', [TestController::class, 'accessByCode']);
    Route::get('/tests/{id}', [TestController::class, 'show']);
    Route::post('/tests', [TestController::class, 'store']);
    Route::put('/tests/{id}', [TestController::class, 'update']);
    Route::delete('/tests/{id}', [TestController::class, 'destroy']);

    // Test Taking
    Route::post('/tests/{id}/start', [TestController::class, 'start']);
    Route::post('/tests/{id}/submit', [TestController::class, 'submit']);
    Route::get('/tests/{id}/attempts', [TestController::class, 'allAttempts']); // Add this line

    // Test Results
    Route::get('/tests/attempts', [TestController::class, 'myAttempts']);
    Route::get('/tests/attempts/{attemptId}', [TestController::class, 'results']);
    Route::get('/tests/attempts/{attemptId}/review', [TestController::class, 'review']);

    // Classes
    Route::get('/classes', [ClassController::class, 'index']);
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
