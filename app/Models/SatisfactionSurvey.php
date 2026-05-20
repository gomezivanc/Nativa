<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class SatisfactionSurvey extends Model
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
        return 'Encuesta de satisfacción';
    }

    function questions() {
        return $this->hasMany(SatisfactionSurveyQuestion::class,'survey_id','id');
    }
}
