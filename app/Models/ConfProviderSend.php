<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class ConfProviderSend extends Model
{
    use HasFactory,SoftDeletes, LogsActivity;

    protected $guarded = [];

    protected static $logAttributes = ['*'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
        ->logOnly(['*']);
    }

    public function getLogNameToUse(string $eventName = ''): string
    {
        return 'Proveedores';
    }

    function service() {
        return $this->hasOne(ConfServicesProvider::class,'id','conf_services_provider_id');
    }

    function departament() {
        return $this->hasOne(Departamento::class,'id','dep_id');
    }
    function city() {
        return $this->hasOne(Ciudad::class,'id','ciu_id');
    }
    function regional() {
        return $this->hasOne(Regional::class,'id','regional_id');
    }
}
