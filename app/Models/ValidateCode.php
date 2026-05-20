<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ValidateCode extends Model
{
    protected $table      = 'verification_code';
    protected $fillable = ['codigo_validate', 'estado', 'fecha_inicio', 'fecha_fin', 'id_usuario'];
}