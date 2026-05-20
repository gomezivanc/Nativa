<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class FilingEmail extends Model
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
        return 'Radicación por correo';
    }

    function to() {
        return $this->hasMany(FilingEmailTo::class,'filing_email_id','id');
    }

    function user() {
        return $this->hasOne(User::class, 'id', 'from_id');
    }

    function attachments() {
        return $this->hasMany(FilingEmailAttach::class,'filing_email_id','id');
    }
}
