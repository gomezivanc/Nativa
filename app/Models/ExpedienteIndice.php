<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExpedienteIndice extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'expediente_indices';
    protected static $logAttributes = ['*'];
    protected $guarded = [];

    public function indice()
    {
        return $this->belongsTo(Indice::class, 'indice_id');
    }
}

