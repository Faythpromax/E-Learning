<?php

namespace App\Listeners;

use App\Events\TestCreated;
use App\Notifications\NewTestAssignedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;

class SendTestCreatedNotification implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(TestCreated $event): void
    {
        $test = $event->test;
        
        // Load classes and their students
        $test->load(['classes.students', 'subject']);

        $students = collect();
        foreach ($test->classes as $class) {
            $students = $students->concat($class->students);
        }

        $uniqueStudents = $students->unique('id');

        if ($uniqueStudents->isNotEmpty()) {
            Notification::send($uniqueStudents, new NewTestAssignedNotification($test));
        }
    }
}
