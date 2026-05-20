<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FilingEmailTo extends Model
{
    use HasFactory;

    function user() {
        return $this->belongsTo(User::class, 'to_id', 'id');
    }
}
