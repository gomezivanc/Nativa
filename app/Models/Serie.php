<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Subserie;
use App\Models\Retencion;

class Serie extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'serie';
    protected static $logAttributes = ['*'];
    protected $guarded = [];

    public function subseries()
    {
        return $this->hasMany(Subserie::class, 'serie_id');
    }

    public function retencion()
    {
        return $this->belongsTo(Retencion::class, 'retencion_id');
    }
}
