<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AccumulatedFund extends Model
{
    use HasFactory,SoftDeletes;

    protected $casts = [
        'serie' => 'collection',
        'subserie' => 'collection',
        'type_document' => 'collection',
        'floor' => 'integer',
        'rack' => 'integer',
        'module' => 'integer',
        'panel' => 'integer',
        'box' => 'integer',
    ];

    function departament() {
        return $this->hasOne(Departamento::class,'id','dep_id');
    }
    function city() {
        return $this->hasOne(Ciudad::class,'id','ciu_id');
    }
    function third() {
        return $this->hasOne(Thirds::class,'id','remi_desti_id');
    }
    function clasification() {
        return $this->hasOne(ExpFilesClasification::class,'id','clasification_id');
    }

    function ubication() {
        return $this->hasOne(PhysicalSpacesUbications::class, 'id','file_area_id');
    }
    function typeBody() {
        return $this->hasOne(TypesBody::class, 'id','type_body_id');
    }

    function user() {
        return $this->hasOne(User::class, 'id','creado_por_id');
    }

    function typeArea() {
        return $this->hasOne(PhysicalSpacesUbications::class, 'id','file_area_id');
    }
}
