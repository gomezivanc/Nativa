<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsersGroupsDependency extends Model
{
    use HasFactory;

    protected $guarded = [];

    function dependency() {
        return $this->hasOne(GDDependency::class,'id','dependency_id');
    }
}
