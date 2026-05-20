<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExpFilesFiles extends Model
{
    use HasFactory,SoftDeletes;

    protected $casts = [
        'file_detail' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($expFile) {
            if (empty($expFile->status)) {
                $expFile->state_loan_id = 1;
            }
        });
    }

    function supportType() {
        return $this->hasOne(ExpFilesSupportType::class, 'id','support_type_id');
    }

    public function creador()
    {
        return $this->belongsTo(User::class, 'creado_por_id');
    }

    function expFile() {
        return $this->hasOne(ExpFiles::class, 'id','exp_file_id');
    }

    public function expFilesArchiveds()
    {
        return $this->hasManyThrough(
            ExpFilesArchived::class,  // Modelo destino
            ExpFiles::class,           // Modelo intermedio
            'id',                      // Clave en ExpFiles relacionada con A
            'exp_file_id',             // Clave en ExpFilesArchived relacionada con ExpFiles
            'exp_file_id',             // Clave en A para acceder a ExpFiles
            'id'                       // Clave primaria en ExpFiles
        );
    }
    public function expFilesArchived()
    {
        return $this->hasOneThrough(
            ExpFilesArchived::class,  // Modelo destino
            ExpFiles::class,           // Modelo intermedio
            'id',                      // Clave en ExpFiles relacionada con A
            'exp_file_id',             // Clave en ExpFilesArchived relacionada con ExpFiles
            'exp_file_id',             // Clave en A para acceder a ExpFiles
            'id'                       // Clave primaria en ExpFiles
        );
    }

    function stateLoan()  {
        return $this->hasOne(TypeDocumentaryLoans::class,'id','state_loan_id');
    }

    public function documentaryLoan()
    {
        return $this->hasOne(DocumentaryLoan::class,'exp_files_file_id','id');
    }

    function created_by() {
        return $this->hasOne(User::class,'id','creado_por_id');
    }

    function historicLoan() {
        return $this->hasMany(HistoricLoan::class,'exp_files_file_id','id');
    }

    public function typeDocumental()
    {
        return $this->belongsTo(ExpFilesTypeDoc::class, 'type_doc_id');
    }
}
