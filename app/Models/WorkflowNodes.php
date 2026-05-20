<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class WorkflowNodes extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $guarded = [];
    protected $casts = [
        'node_data' => 'collection',
    ];
    protected static $logAttributes = ['*'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
        ->logOnly(['*']);
    }

    public function getLogNameToUse(string $eventName = ''): string
    {
        return 'Flujo de trabajo: Nodo';
    }

    function workflow() {
        return $this->hasOne(Workflow::class,'id','workflow_id');
    }

    function lastNode() {
        return $this->hasOne(WorkflowNodes::class,'id','last_node');
    }
    function lastNodeConditional() {
        return $this->hasOne(WorkflowNodes::class,'id','conditional_wf_node_id');
    }

    function edges_node() {
        return $this->hasMany(WorkflowEdges::class,'node_id','id');
    }
    function edges_node_second() {
        return $this->hasMany(WorkflowEdges::class,'second_node_id','id');
    }
}
