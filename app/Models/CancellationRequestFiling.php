<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CancellationRequestFiling extends Model
{
    use HasFactory, SoftDeletes;
    protected $guarded = [];
    public function filing()
    {
        return $this->hasOne(Filing::class, 'id', 'filing_id');
    }
    public function user()
    {
        return $this->hasOne(User::class, 'id', 'creado_por_id');
    }
}
