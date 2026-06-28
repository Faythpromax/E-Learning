<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassPractice extends Model
{
    protected $table = 'class_practices';

    protected $fillable = [
        'class_id',
        'practice_id',
    ];
}
