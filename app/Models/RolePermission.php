<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RolePermission extends Model
{
    // protected $connection = 'tolima';

    protected $table = 'role_has_permissions';
    protected static $logAttributes = ['*'];
    protected $guarded = [];


}
