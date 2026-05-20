<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Answer extends Model
{
    use SoftDeletes;

    protected $table = 'filed_departure';
    protected $fillable = ['*'];

    public function filing()
    {
        return $this->belongsTo(Filing::class, 'filings_id');
    }
    
    public function responseTemplate()
    {
        return $this->belongsTo(ResponseTemplate::class, 'id_response_template');
    }
}
