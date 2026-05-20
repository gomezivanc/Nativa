<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Support\Facades\DB;

class PasswordReset extends Model
{
	// use LogsActivity;
    
    // protected $primaryKey = 'email'; 
	protected static $logAttributes = ['*'];

    protected static $logName       = 'password reset';

    protected $table = 'password_resets';

    protected $fillable = [
        'email', 'token'
    ];
    protected $primaryKey = 'email';
    public $incrementing = false;
    public $timestamps = false;
}
