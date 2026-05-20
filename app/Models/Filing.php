<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Filing extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $casts = ['serie' => 'array', 'sub_serie' => 'array'];
    protected $guarded = [];
    protected static $logAttributes = ['*'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
        ->logOnly(['*']);
    }

    public function getLogNameToUse(string $eventName = ''): string
    {
        return 'Radicación estandar';
    }

    public function typesFilings()
    {
        return $this->hasOne(TypesFilings::class, 'id', 'types_filings_id');
    }
    public function documentalType()
    {
        return $this->hasOne(ExpFilesTypeDoc::class, 'id', 'document_type_id');
    }
    public function clasification()
    {
        return $this->hasOne(ExpFilesClasification::class, 'id', 'clasification_id');
    }
    public function priority()
    {
        return $this->hasOne(Priority::class, 'id', 'priority_id');
    }
    public function dependency()
    {
        return $this->hasOne(GDDependency::class, 'id', 'dependency_id');
    }
    public function user()
    {
        return $this->hasOne(User::class, 'id', 'creado_por_id');
    }
    public function peopleType()
    {
        return $this->hasOne(TypePerson::class, 'id', 'type_person_id_sender');
    }
    public function country()
    {
        return $this->hasOne(Country::class, 'id', 'country_id');
    }
    public function department()
    {
        return $this->hasOne(Departamento::class, 'id', 'department_id');
    }
    public function city()
    {
        return $this->hasOne(Ciudad::class, 'id', 'city_id');
    }
    public function receptionMedia()
    {
        return $this->hasOne(ReceptionMedium::class, 'id', 'reception_medium_id');
    }
    public function official()
    {
        return $this->hasOne(User::class, 'id', 'official_id');
    }

    public function distributionUnit()
    {
        return $this->belongsTo(DistributionUnit::class, 'distribution_id_filing', 'id');
    }

    public function chargeDocFilings(){
        return $this->hasMany(ChargeDocFiling::class,'filing_id','id');
    }

    function workflow() {
        return $this->hasOne(Workflow::class,'id','workflow_id');
    }

    function nodesAdvanceds() {
        return $this->hasMany(FilingWorkflow::class,'filing_id','id');
    }

    function current_node() {
        return $this->hasOne(WorkflowNodes::class,'id','current_node_id');
    }
    function associated_filings() {
        return $this->hasMany(AssociatedFiling::class,'father_filing_id','id');
    }
    function filing_logs() {
        return $this->hasMany(FilingLog::class,'filing_id','id');
    }

    public function typeOfProcedure()
    {
        return $this->belongsTo(TypeOfProcedure::class, 'typeProcess_id', 'id');
    }

    public function responseTemplates()
    {
        return $this->hasMany(ResponseTemplate::class, 'filings_id');
    }

    public function filedDeparture()
    {
        return $this->hasMany(Answer::class, 'filings_id');
    }

    public function copies()
    {
        return $this->hasMany(CopyFiling::class, 'id_filing', 'id');
    }

    public function solicitud()
    {
        return $this->hasOne(Solicitudes::class, 'id_filing');
    }
}
