<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AplicativoUsuario extends Model
{
    protected static $logName       = 'aplicativos_usuario';
    protected static $logAttributes = ['*'];

    protected $table ="aplicativos_usuario";

}
