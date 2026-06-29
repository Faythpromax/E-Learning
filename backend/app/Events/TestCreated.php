<?php

namespace App\Events;

use App\Models\Test;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TestCreated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly Test $test
    ) {}
}
