<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkflowEdges extends Model
{
    use HasFactory;

    protected $guarded = [];
    protected $casts = [
        'edge_data' => 'collection'
    ];
}
