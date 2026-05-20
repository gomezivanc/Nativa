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
        Schema::create('regionals', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Nombre del regional');
            $table->string('sigla')->comment('Sigla del regional');
            $table->foreignId('country_id')->comment('Pais del regional')->constrained('countries');
            $table->unsignedInteger('departament_id')->comment('Departamento del regional');
            $table->foreign('departament_id')->references('id')->on('departamentos');
            $table->foreignId('city_id')->comment('Ciudad del regional')->constrained('ciudades');

            $table->bigInteger('creado_por_id');
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
        Schema::dropIfExists('regionals');
    }
};
