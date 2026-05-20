<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::dropIfExists('hours_not_works');

        Schema::create('hours_not_works', function (Blueprint $table) {
            $table->id();

            $table->date('date')->comment('Fecha exacta del día no laboral (seleccionada con calendario)');
            $table->string('day_of_week', 15)->comment('Nombre del día de la semana (lunes, martes, etc.)');
            $table->string('reason', 100)->comment('Nombre o motivo del día no laboral');
            $table->boolean('is_recurring')->default(false)->comment('Indica si se repite cada año');

            $table->bigInteger('creado_por_id')->comment('Usuario que creó el registro');
            $table->timestamps();
            $table->softDeletes()->comment('Fecha de eliminación lógica');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hours_not_works');
    }
};
