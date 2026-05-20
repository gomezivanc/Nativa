<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DocumentaryLoansExp extends Model
{
    use HasFactory;
    
    function requirements() {
        return $this->hasOne(TypeRequirements::class,'id','type_requirement_id');
    }

    function type_loan() {
        return $this->hasOne(TypeLoan::class,'id','type_loan_id');
    }

    function created_by() {
        return $this->hasOne(User::class,'id','creado_por_id');
    }
}
