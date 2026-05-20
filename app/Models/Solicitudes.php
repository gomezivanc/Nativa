<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Solicitudes extends Model
{
    use SoftDeletes;

    protected $table = 'solicitudes';
    protected $fillable = ['id_filing','id_official', 'tipo', 'observation' , 'estado'];

    public function filing()
    {
        return $this->belongsTo(Filing::class, 'id_filing');
    }
    
    public function official()
    {
        return $this->belongsTo(User::class, 'id_official');
    }
    
}
