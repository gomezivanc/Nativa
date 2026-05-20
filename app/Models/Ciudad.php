<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Ciudad extends Model
{
    
    protected $table = 'ciudades';
    protected $fillable = [
        'iddepartamento',
        'nombre',
        'condicion',
        'codigo_dane'
    ];
}
