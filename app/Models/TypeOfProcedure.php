<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TypeOfProcedure extends Model
{
    use SoftDeletes;

	protected static $logAttributes = ['*'];

    protected $table = 'type_of_procedure';
    
    protected $fillable = [
        'name',
        'response_time',
    ];

    public function filings()
    {
        return $this->hasMany(Filing::class, 'id');
    }
}
