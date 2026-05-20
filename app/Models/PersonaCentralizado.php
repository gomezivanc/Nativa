<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class PersonaCentralizado extends Model
{ 

    protected $connection = 'centralizado';
    protected $table ="personas";

    public function user()
    {   
        return $this->belongsTo(User::class, 'id','id_persona');
        // return $this->belongsTo('App\User');
    }
}