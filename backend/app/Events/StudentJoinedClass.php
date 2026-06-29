<?php

namespace App\Events;

use App\Models\User;
use App\Models\ClassModel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StudentJoinedClass
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly User $student,
        public readonly ClassModel $class
    ) {}
}
