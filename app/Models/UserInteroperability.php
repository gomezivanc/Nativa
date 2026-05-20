<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Tymon\JWTAuth\Contracts\JWTSubject;

class UserInteroperability extends Model implements JWTSubject
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
        return 'Usuario interoperabilidad';
    }

    // Métodos requeridos por la interfaz JWTSubject
    public function getJWTIdentifier()
    {
        return $this->getKey(); // Devuelve la clave primaria del usuario
    }

    public function getJWTCustomClaims()
    {
        return []; // Devuelve un array con claims adicionales si los necesitas
    }

    function dependency() {
        return $this->hasOne(GDDependency::class,'id','dependency_id');
    }
    function typeDocument() {
        return $this->hasOne(TipoDocumento::class,'id','type_document_id');
    }
}
