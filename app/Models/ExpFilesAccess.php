<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExpFilesAccess extends Model
{
    use HasFactory;

    protected $guarded = [];

    function typeControl() {
        return $this->hasOne(ExpFileTypeControl::class,'id','type_control_id');
    }
}
