<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Process extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = ["estado"];
    function responsable() {
        return $this->hasOne(User::class,'id','id_responsable');
    }

    function plaintiffs() {
        return $this->hasOne(Plaintiffs::class,'id','id_demandante');
    }

    function defendant() {
        return $this->hasOne(Defendants::class,'id','id_demandado');
    }

    function judges() {
        return $this->hasOne(Defendants::class,'id','id_juez');
    }

    function typeProcess() {
        return $this->hasOne(TypeProcess::class,'id','id_tipoproceso');
    }

    function theme() {
        return $this->hasOne(Themes::class,'id','id_tema');
    }

    function unity() {
        return $this->hasOne(Unities::class,'id','id_unidad');
    }

    function office() {
        return $this->hasOne(JudicialOffices::class,'id','id_despacho');
    }

    function city() {
        return $this->hasOne(Ciudad::class,'id','id_municipio');
    }

    function fails() {
        return $this->hasMany(ProcessFails::class,'id_proceso','id');
    }

    function processRepetitionStudies() {
        return $this->hasMany(ProcessRepetitionStudy::class,'id_proceso','id');
    }
}
