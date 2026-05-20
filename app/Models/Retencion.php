<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Retencion extends Model
{
    protected $table = 'retencion';
    protected static $logAttributes = ['*'];
    protected $guarded = [];

    public function tiposDocumentales()
    {
        return $this->belongsToMany(ExpFilesTypeDoc::class, 'retencion_tipo_documental', 'retencion_id', 'tipo_documental_id');
    }
    
    public function indices()
    {
        return $this->hasMany(RetencionIndice::class, 'retencion_id');
    }
}
