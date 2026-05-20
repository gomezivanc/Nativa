<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payments extends Model
{
    use HasFactory,SoftDeletes;

    function files() {
        return $this->hasMany(PaymentAttachs::class,'pago_id','id');
    }

    function secretary() {
        return $this->hasOne(Secretary::class,'id','id_secretaria');
    }
    function process() {
        return $this->hasOne(Process::class,'id','id_process');
    }
}
