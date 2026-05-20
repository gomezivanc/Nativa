<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Models\UserCentralizado;
class Persona extends Model
{ 

    protected $table ="personas";

    public function user()
    {   
        return $this->belongsTo(User::class, 'id','id_persona');
    }
}