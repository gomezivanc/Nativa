<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Workflow extends Model
{
    use HasFactory,SoftDeletes,LogsActivity;

    protected static $logAttributes = ['*'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
        ->logOnly(['*']);
    }

    public function getLogNameToUse(string $eventName = ''): string
    {
        return 'Flujo de trabajo';
    }

    protected $guarded = [];

    function nodes() {
        return $this->hasMany(WorkflowNodes::class,'workflow_id','id');
    }

    function edges() {
        return $this->hasMany(WorkflowEdges::class,'workflow_id','id');
    }
}
