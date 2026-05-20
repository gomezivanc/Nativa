<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CopyFiling extends Model
{
    use SoftDeletes;

    protected $table = 'copy_filing';
    protected $fillable = ['*'];
}
