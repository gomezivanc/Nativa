<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class ReceivedEmail extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $table = 'received_emails';

    protected $guarded = [];

    protected $casts = [
        'attachments' => 'array',
        'received_at' => 'datetime',
    ];

    protected static $logAttributes = ['*'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['*']);
    }

    public function getLogNameToUse(string $eventName = ''): string
    {
        return 'received_emails';
    }

    /**
     * Relationship with MailConfig
     */
    public function mailConfig()
    {
        return $this->belongsTo(MailConfig::class, 'mail_config_id');
    }

    /**
     * Relationship with DistributionUnit
     */
    public function distributionUnit()
    {
        return $this->belongsTo(DistributionUnit::class, 'distribution_unit_id');
    }
}

