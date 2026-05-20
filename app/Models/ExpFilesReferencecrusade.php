<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExpFilesReferencecrusade extends Model
{
    use HasFactory;

    function ExpFiles() {
        return $this->hasOne(ExpFiles::class,'id','exp_file_id');
    }
}
