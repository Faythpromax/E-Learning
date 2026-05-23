<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    public function run(): void
    {
        $subjects = [
            ['name' => 'Toán', 'class_level' => 'Lớp 1'],
            ['name' => 'Toán', 'class_level' => 'Lớp 2'],
            ['name' => 'Tiếng Việt', 'class_level' => 'Lớp 1'],
            ['name' => 'Tiếng Việt', 'class_level' => 'Lớp 2'],
            ['name' => 'Khoa học', 'class_level' => 'Lớp 2'],
            ['name' => 'Tiếng Anh', 'class_level' => 'Lớp 1'],
        ];

        foreach ($subjects as $subject) {
            Subject::create($subject);
        }
    }
}
