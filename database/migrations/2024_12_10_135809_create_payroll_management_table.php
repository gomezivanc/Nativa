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
        Schema::create('payroll_management', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Nombre de la plantilla');
            $table->string('file')->nullable()->comment('Archivo de la plantilla');
            $table->string('filename')->nullable()->comment('Nombre de archivo de la plantilla');

            $table->bigInteger('creado_por_id')->comment('Columna para saber que creo');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('payroll_management');
    }
};
