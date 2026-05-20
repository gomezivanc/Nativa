<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SatisfactionSurveyResponses extends Model
{
    use HasFactory;

    function satisfaction() {
        return $this->belongsTo(SatisfactionSurvey::class,'survey_id');
    }

    function question() {
        return $this->belongsTo(SatisfactionSurveyQuestion::class,'question_id');
    }

    function user() {
        return $this->belongsTo(User::class,'user_id');
    }
}
