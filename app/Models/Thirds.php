<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Thirds extends Model
{
    use HasFactory,SoftDeletes, LogsActivity;

    protected static $logAttributes = ['*'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
        ->logOnly(['*']);
    }

    public function getLogNameToUse(string $eventName = ''): string
    {
        return 'Terceros';
    }

    public function city()
    {
        return $this->hasOne(Ciudad::class, 'id', 'city_id');
    }

    public function country()
    {
        return $this->hasOne(Country::class, 'id', 'country_id');
    }
    
    public function department()
    {
        return $this->hasOne(Departamento::class, 'id', 'department_id');
    }

    public function tipoDocumento()
    {
        return $this->hasOne(TipoDocumento::class, 'id', 'type_document_id');
    }
}
