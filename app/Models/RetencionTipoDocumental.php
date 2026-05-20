<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RetencionTipoDocumental extends Model
{
    use HasFactory;
    protected $table = 'retencion_tipo_documental';
    protected static $logAttributes = ['*'];
    
}
