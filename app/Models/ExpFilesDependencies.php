<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExpFilesDependencies extends Model
{
    use HasFactory;
    protected $guarded = [];

    function dependency() {
        return $this->belongsTo(GDDependency::class,'dependency_id');
    }
}
