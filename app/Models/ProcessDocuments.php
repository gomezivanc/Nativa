<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProcessDocuments extends Model
{
    use HasFactory,SoftDeletes;

    function process() {
        return $this->hasOne(Process::class,'id','nro_contrato');
    }

    function category() {
        return $this->hasOne(DocumentCategories::class,'id','id_categoria');
    }
}
