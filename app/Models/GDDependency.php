<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class GDDependency extends Model
{
    use HasFactory,SoftDeletes, LogsActivity;

    protected $guarded = [];
    protected $casts = [
        'created_at' => 'datetime:d-m-Y H:i:s',
        'updated_at ' => 'datetime:d-m-Y H:i:s',
        'deleted_at ' => 'datetime:d-m-Y H:i:s',
    ];
    protected static $logAttributes = ['*'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
        ->logOnly(['*']);
    }

    public function getLogNameToUse(string $eventName = ''): string
    {
        return 'Dependencias';
    }

    function regional() {
        return $this->belongsTo(Regional::class, 'regional_id', 'id');
    }

    function gdDependency() {
        return $this->hasOne(GDDependency::class,'id','g_d_parent_id');
    }

    function gdDependenciesChildrens() {
        return $this->hasMany(GDDependency::class,'g_d_parent_id','id');
    }

    function historic() {
        return $this->hasMany(DependencyHistoric::class,'gd_dependency_id','id');
    }
    function current_version() {
        return $this->hasOne(DependencyHistoric::class,'id','current_version_id');
    }
    
    public function series()
    {
        return $this->hasMany(Serie::class, 'dependency_id');
    }

    public function dependencyTemplates()
    {
        return $this->hasMany(DependencyTemplate::class, 'id_dependency');
    }

    public function dependencyCharge()
    {
        return $this->hasMany(Charge::class, 'id_dependency');
    }
}
