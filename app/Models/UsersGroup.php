<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class UsersGroup extends Model
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
        return 'Grupos de usuario';
    }

    function users() {
        return $this->hasMany(UserGroupsUsers::class,'users_group_id','id');
    }

    function dependencies() {
        return $this->hasMany(UsersGroupsDependency::class,'group_id','id');
    }
}
