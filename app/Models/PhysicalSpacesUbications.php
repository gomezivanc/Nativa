<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PhysicalSpacesUbications extends Model
{
    use HasFactory, SoftDeletes;
    protected $guarded = [];

    function building() {
        return $this->hasOne(PhysicalSpace::class,'id','physical_space_id');
    }

    function typeBody() {
        return $this->hasOne(TypesBody::class,'id','type_body_id');
    }
}
