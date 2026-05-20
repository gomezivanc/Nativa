<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Regional extends Model
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
        return 'Principal y regionales';
    }

    function country() {
        return $this->hasOne(Country::class,'id','country_id');
    }

    function departament() {
        return $this->hasOne(Departamento::class,'id','departament_id');
    }

    function city() {
        return $this->hasOne(Ciudad::class,'id','city_id');
    }

    function chargeRegional() {
        return $this->hasOne(Charge::class,'id_regional');
    }

    function dependencies() {
        return $this->hasMany(GDDependency::class, 'regional_id', 'id');
    }
}
