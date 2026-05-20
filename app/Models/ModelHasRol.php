<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Role;

class ModelHasRol extends Model
{
    use HasFactory;
    protected $table      = 'model_has_roles';
    public $timestamps    = false;

    protected $fillable = [
        'role_id',
        'model_id',
        'model_type',
    ];
    
    protected static $logAttributes = ['*'];

    public function roles(){
        return $this->hasOne(Role::class,'id','role_id');
    }

}
