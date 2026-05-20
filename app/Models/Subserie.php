<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Retencion;

class Subserie extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'subserie';
    protected static $logAttributes = ['*'];
    protected $guarded = [];

    public function retencion()
    {
        return $this->belongsTo(Retencion::class, 'retencion_id');
    }
}
