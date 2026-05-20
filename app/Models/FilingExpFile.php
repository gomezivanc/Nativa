<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FilingExpFile extends Model
{
    use HasFactory,SoftDeletes;
    protected $guarded = [];
    protected $fillable = [
        'filing_id',
        'exp_file_id',
        'creado_por_id'
    ];
}
