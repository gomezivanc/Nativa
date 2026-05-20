<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class DependencyTemplate extends Model
{
    use HasFactory,SoftDeletes,LogsActivity;

    protected $guarded = [];

    protected static $logAttributes = ['*'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
        ->logOnly(['*']);
    }
    
    public function payroll()
    {
        return $this->belongsTo(PayrollManagement::class, 'id_template');
    }

    public function dependency()
    {
        return $this->belongsTo(GDDependency::class, 'id_dependency');
    }

}
