<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Charge extends Model
{
    use SoftDeletes;
    
    protected $table = 'charges';
    protected $guarded = [];


    public function dependency()
    {
        return $this->belongsTo(GDDependency::class, 'id_dependency');
    }

    public function regional()
    {
        return $this->belongsTo(Regional::class, 'id_regional');
    }
}
