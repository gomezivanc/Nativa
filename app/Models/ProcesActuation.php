<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProcesActuation extends Model
{
    use HasFactory,SoftDeletes;

    function Proces() {
        return $this->hasOne(Process::class,'id','id_proceso');
    }
    function ProcesState() {
        return $this->hasOne(ProcessState::class,'id','estado');
    }
    function Alert() {
        return $this->hasOne(ProcesNotices::class,'id_instancia','id');
    }
}
