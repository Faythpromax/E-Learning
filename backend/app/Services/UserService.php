<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function getUsers(array $filters = []): LengthAwarePaginator
    {
        $query = User::query();

        if (!empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $perPage = $filters['per_page'] ?? 15;

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getUser(int $id): ?User
    {
        return User::find($id);
    }

    public function updateUser(int $id, array $data): array
    {
        $user = User::find($id);

        if (!$user) {
            return [
                'success' => false,
                'message' => 'Khong tim thay nguoi dung',
            ];
        }

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return [
            'success' => true,
            'user' => $user->fresh(),
        ];
    }

    public function deleteUser(int $id): array
    {
        $user = User::find($id);

        if (!$user) {
            return [
                'success' => false,
                'message' => 'Khong tim thay nguoi dung',
            ];
        }

        if ($user->role === 'admin') {
            return [
                'success' => false,
                'message' => 'Khong the xoa tai khoan quan tri',
            ];
        }

        $user->delete();

        return [
            'success' => true,
            'message' => 'Xoa nguoi dung thanh cong',
        ];
    }

    public function getTeachers(): \Illuminate\Database\Eloquent\Collection
    {
        return User::where('role', 'teacher')
            ->orderBy('name')
            ->get();
    }

    public function getStudents(): \Illuminate\Database\Eloquent\Collection
    {
        return User::where('role', 'student')
            ->orderBy('name')
            ->get();
    }

    public function getCounts(): array
    {
        return [
            'teachers_count' => User::where('role', 'teacher')->orWhere('role', 'admin')->count(),
            'students_count' => User::where('role', 'student')->count(),
        ];
    }
}
