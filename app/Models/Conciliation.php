<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Conciliation extends Model
{
    use HasFactory,SoftDeletes;

    function process() {
        return $this->hasOne(Process::class,'id','id_proceso');
    }

    function typeConciliation() {
        return $this->hasOne(TypeConciliation::class,'id','tipo');
    }
}
