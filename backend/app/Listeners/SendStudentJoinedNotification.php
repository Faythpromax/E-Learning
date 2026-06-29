<?php

namespace App\Listeners;

use App\Events\StudentJoinedClass;
use App\Notifications\StudentJoinedClassNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendStudentJoinedNotification implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(StudentJoinedClass $event): void
    {
        $student = $event->student;
        $class = $event->class;
        
        // Load the creator (teacher) of the class
        $class->load('creator');
        
        $teacher = $class->creator;

        if ($teacher) {
            $teacher->notify(new StudentJoinedClassNotification($student, $class));
        }
    }
}
