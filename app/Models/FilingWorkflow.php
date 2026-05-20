<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FilingWorkflow extends Model
{
    use HasFactory;

    function node() {
        return $this->hasOne(WorkflowNodes::class,'id','node_id');
    }

    function filing() {
        return $this->hasOne(Filing::class,'id','filing_id');
    }
}
