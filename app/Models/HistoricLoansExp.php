<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoricLoansExp extends Model
{
    use HasFactory;

    function stateLoan() {
        return $this->hasOne(TypeDocumentaryLoans::class, 'id','state_loan_id');
    }
    function created_by() {
        return $this->hasOne(User::class, 'id','creado_por_id');
    }

    function expFileFiles() {
        return $this->hasOne(ExpFilesFiles::class,'id','exp_files_file_id');
    }
}
