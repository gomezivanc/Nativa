<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ResponseEmail extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'response_emails';

    protected $fillable = [
        'response_template_id',
        'email',
        'status',
        'error_message',
        'sent_at',
        'bounced_at',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
        'bounced_at' => 'datetime',
    ];

    public function responseTemplate()
    {
        return $this->belongsTo(ResponseTemplate::class, 'response_template_id');
    }

    // Scopes para consultas comunes
    public function scopeSuccessful($query)
    {
        return $query->where('status', 'success');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    public function scopeBounced($query)
    {
        return $query->where('status', 'bounced');
    }
}
