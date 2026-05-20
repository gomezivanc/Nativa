<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DocumentaryLoan extends Model
{
    use HasFactory,SoftDeletes;

    function typeLoan() {
        return $this->hasOne(TypeLoan::class,'id','type_loan_id');
    }
    function requirement() {
        return $this->hasOne(TypeRequirements::class,'id','type_requirement_id');
    }
}
