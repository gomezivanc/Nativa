<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('satisfaction_survey_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('survey_id')->comment('Id de la encuesta')->constrained('satisfaction_surveys');
            $table->foreignId('question_id')->comment('Id de la pregunta')->constrained('satisfaction_survey_questions');
            $table->text('response')->comment('respuesta')->nullable();
            $table->bigInteger('user_id')->comment('Usuario quien respondio');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('satisfaction_survey_responses');
    }
};
