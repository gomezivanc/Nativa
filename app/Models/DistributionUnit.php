<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DistributionUnit extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'distribution_units';

    protected $fillable = [
        'id_dependency',
        'name',
        'observation',
    ];

    /**
     * Relationship with GDDependency
     */
    public function dependency()
    {
        return $this->belongsTo(GDDependency::class, 'id_dependency');
    }

    /**
     * Relationship with Filing (radicados)
     */
    public function filings()
    {
        return $this->hasMany(Filing::class, 'distribution_id_filing', 'id');
    }
}
