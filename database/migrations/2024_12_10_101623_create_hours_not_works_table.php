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
        Schema::create('hours_not_works', function (Blueprint $table) {
            $table->id();
            $table->string('day_of_week_init')->comment('Dia de inicio');
            $table->string('day_of_week_end')->comment('Dia fin');
            $table->string('init_work_hour')->comment('Inicio en horas');
            $table->string('end_work_hour')->comment('Fin en horas');
            
            $table->bigInteger('creado_por_id')->comment('Usuario creador del registro');
            $table->timestamps();
            $table->softDeletes()->comment('Fecha de eliminación');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hours_not_works');
    }
};
