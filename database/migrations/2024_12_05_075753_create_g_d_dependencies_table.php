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
        Schema::create('g_d_dependencies', function (Blueprint $table) {
            $table->id();
            $table->string('code')->comment('Codigo de dependencia');
            $table->string('name')->comment('Nombre de dependencia');
            $table->unsignedBigInteger('g_d_parent_id')->comment('ID del padre')->nullable();
            // $table->unsignedInteger('dep_id')->comment('ID del departamento');
            // $table->foreign('dep_id')->references('id')->on('departamentos');
            // $table->unsignedBigInteger('ciu_id')->comment('ID de la ciudad');
            // $table->foreign('ciu_id')->references('id')->on('ciudades');
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
        Schema::dropIfExists('g_d_dependencies');
    }
};
