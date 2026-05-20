<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Support\Facades\Session;
use Spatie\Activitylog\LogOptions;

class Rol extends \Spatie\Permission\Models\Role
{
    use LogsActivity;
    use HasFactory,SoftDeletes;
    protected static $logAttributes = ['*'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
        ->logOnly(['*']);
    }

    public function getLogNameToUse(string $eventName = ''): string
    {
        return 'Roles';
    }

    protected static $logName = 'rol';
    protected $guard_name = "web";

    protected $table = 'roles';
    protected $guarded = [];


    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
    }

    public static function rolesDefault()
    {
        $roles_array = [
            '1' => [
                'super_administrador'
            ],
            '2' => [
                'administrador'
            ]
        ];

        return $roles_array;
    }

    public static function rolesDefault2()
    {
        $roles_array = [
            'administrador' => '1',
            'super_administrador' => '2',

        ];

        return $roles_array;
    }
    public function getPermissions()
    {
        return $this->belongsToMany(RolePermission::class);
    }

}
