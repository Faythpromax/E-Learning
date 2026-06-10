<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubjectSeeder extends Seeder
{
    public function run(): void
    {
        // Insert the default subjects (without truncating to keep foreign keys)
        $subjects = [
            ['name' => 'Math', 'class_level' => 'General'],
            ['name' => 'Vietnamese', 'class_level' => 'General'],
            ['name' => 'English', 'class_level' => 'General'],
            ['name' => 'Science', 'class_level' => 'General'],
        ];

        foreach ($subjects as $subject) {
            DB::table('subjects')->updateOrInsert(
                ['name' => $subject['name']],
                $subject
            );
        }

        $this->command->info('Subjects seeded successfully!');
    }
}
