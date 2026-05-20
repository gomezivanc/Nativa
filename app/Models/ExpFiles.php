<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Models\Activity;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Permission\Traits\HasRoles;

class ExpFiles extends Model
{
    use HasFactory,SoftDeletes, HasRoles, LogsActivity;

    protected $guarded = [];
    protected $guard_name = 'web';
    protected $casts = [
        'serie' => 'collection',
        'subserie' => 'collection',
    ];
    protected static $logAttributes = ['*'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
        ->logOnly(['*']);
    }

    public function getLogNameToUse(string $eventName = ''): string
    {
        return 'Expedientes';
    }

    // Relación con la tabla de logs de actividad
    public function logs()
    {
        return $this->morphMany(Activity::class, 'subject');
    }


    function dependencies() {
        return $this->hasMany(ExpFilesDependencies::class,'exp_file_id','id');
    }

    function dependency() {
        return $this->hasOne(GDDependency::class,'id','dependency_id');
        
    }

    function subExp() {
        return $this->hasMany(ExpFiles::class,'sub_exp_id','id');
    }
    function subExpFather() {
        return $this->hasOne(ExpFiles::class,'id','sub_exp_id');
    }

    function createBy() {
        return $this->hasOne(User::class,'id','creado_por_id');
    }

    function responsible() {
        return $this->hasOne(User::class,'id','responsible_id');
    }

    function clasification() {
        return $this->hasOne(ExpFilesClasification::class,'id','clasification_id');
    }

    function files() {
        return $this->hasMany(ExpFilesFiles::class,'exp_file_id','id');
    }

    function deleted_user() {
        return $this->hasOne(User::class,'id','deleted_by');
    }

    function expFilesArchived() {
        return $this->hasOne(ExpFilesArchived::class,'exp_file_id','id');
    }
    function expFilesArchiveds() {
        return $this->hasMany(ExpFilesArchived::class,'exp_file_id','id');
    }

    function acccess() {
        return $this->hasMany(ExpFilesAccess::class,'exp_file_id','id');
    }

    function stateLoan()  {
        return $this->hasOne(TypeDocumentaryLoans::class,'id','state_loan_id');
    }

    function documentaryLoanLatest() {
        return $this->hasOne(DocumentaryLoansExp::class,'exp_file_id','id')->latest();
    }

    function documentaryLoan() {
        return $this->hasOne(DocumentaryLoansExp::class,'exp_file_id','id');
    }

    function historicLoan() {
        return $this->hasMany(HistoricLoansExp::class,'exp_file_id','id');
    }
    function historicLoanLatest() {
        return $this->hasMany(HistoricLoansExp::class,'exp_file_id','id')->latest();
    }

    function filing() {
        return $this->hasOneThrough(
            Filing::class,       // Modelo destino
            FilingExpFile::class, // Modelo intermedio
            'exp_file_id',       // Clave foránea en el modelo intermedio (relación con exp_files)
            'id',                // Clave primaria en el modelo destino (filings)
            'id',                // Clave primaria en el modelo origen (exp_files)
            'filing_id'          // Clave foránea en el modelo intermedio (relación con filings)
        );
    }

    public function filings()
    {
        return $this->belongsToMany(
            Filing::class,
            'filing_exp_files',
            'exp_file_id',
            'filing_id'
        );
    }
    
    public function indices()
    {
        return $this->hasMany(ExpedienteIndice::class, 'exp_id');
    }
}
