<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class FilingSetting extends Model
{
    use HasFactory,SoftDeletes, LogsActivity;

    protected $guarded=[];
    protected static $logAttributes = ['*'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
        ->logOnly(['*']);
    }

    public function getLogNameToUse(string $eventName = ''): string
    {
        return 'Configuración de radicado';
    }
    public function filingStructure()
    {
        return $this->hasOne(FilingStructure::class, 'id','filling_structure_id');
    }
}
