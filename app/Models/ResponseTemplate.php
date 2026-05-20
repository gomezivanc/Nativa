<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ResponseTemplate extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'response_templates';

    protected $fillable = [
        'third_id',
        'payroll_id',
        'template_url'
    ];

    public function third()
    {
        return $this->belongsTo(Thirds::class, 'third_id');
    }

    public function template()
    {
        return $this->belongsTo(PayrollManagement::class, 'payroll_id');
    }

    public function filing()
    {
        return $this->belongsTo(Filing::class, 'filings_id');
    }

    public function answers()
    {
        return $this->hasOne(Answer::class, 'id_response_template');
    }

    public function emails()
    {
        return $this->hasMany(ResponseEmail::class, 'response_template_id');
    }

    public function signatories()
    {
        return $this->hasMany(Signatory::class, 'response_id');
    }

    public function elabora()
    {
        return $this->belongsTo(User::class, 'id_elabora');
    }

    public function revisa()
    {
        return $this->belongsTo(User::class, 'id_revisa');
    }

    public function aprueba()
    {
        return $this->belongsTo(User::class, 'id_aprueba');
    }
}
