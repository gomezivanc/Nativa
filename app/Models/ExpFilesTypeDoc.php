<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExpFilesTypeDoc extends Model
{
    use HasFactory;

    protected $appends = ['nombre'];

    public function getNombreAttribute()
    {
        // Usar name_es por defecto, o name_en como alternativa
        return $this->attributes['name_es'] ?? $this->attributes['name_en'] ?? '';
    }
}
