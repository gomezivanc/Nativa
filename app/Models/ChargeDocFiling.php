<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ChargeDocFiling extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'creador_por_id');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'creado_por_id');
    }

    function supportType() {
        return $this->hasOne(ExpFilesSupportType::class, 'id','support_type_id');
    }

    public function typeDocumental()
    {
        return $this->belongsTo(ExpFilesTypeDoc::class, 'type_doc_id');
    }
}
