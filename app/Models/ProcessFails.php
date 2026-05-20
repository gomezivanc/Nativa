<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProcessFails extends Model
{
    use HasFactory,SoftDeletes;

    function process() {
        return $this->hasOne(Process::class,'id','id_proceso');
    }

    function instance() {
        return $this->hasOne(ProcessInstance::class,'id','instancia');
    }

    function result() {
        return $this->hasOne(ProcessResults::class,'id','resultado');
    }
}
