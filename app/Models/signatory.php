<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class signatory extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'signatories';


    public function responseTemplate()
    {
        return $this->belongsTo(ResponseTemplate::class, 'response_id');
    }

    public function official()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
