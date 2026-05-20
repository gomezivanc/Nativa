<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RetencionIndice extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'retencion_indices';
    protected static $logAttributes = ['*'];
    protected $guarded = [];
    protected $fillable = [
        'retencion_id',
        'indice_id',
        'orden',
        'obligatorio'
    ];

    public function indice()
    {
        return $this->belongsTo(Indice::class, 'indice_id');
    }
}

