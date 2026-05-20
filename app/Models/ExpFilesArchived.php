<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class ExpFilesArchived extends Model
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
        return 'Archivar expediente';
    }

    function ubication() {
        return $this->hasOne(PhysicalSpacesUbications::class, 'id','file_area_id');
    }

    function typeBody() {
        return $this->hasOne(TypesBody::class, 'id','type_body_id');
    }

    function user() {
        return $this->hasOne(User::class, 'id','creado_por_id');
    }

    function typeArea() {
        return $this->hasOne(PhysicalSpacesUbications::class, 'id','file_area_id');
    }
}
