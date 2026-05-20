<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuOld extends Model
{
    
    protected $table = 'menus';
    protected $fillable = ['name', 'component', 'id_permiso', 'menu_id', 'icon'];
}
