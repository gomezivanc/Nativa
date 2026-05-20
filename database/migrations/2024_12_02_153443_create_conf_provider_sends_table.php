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
        Schema::create('conf_provider_sends', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Nombre del proveedor');
            $table->foreignId('conf_services_provider_id')->comment('ID del servicio del proveedor')->constrained('conf_services_providers');
            $table->unsignedInteger('dep_id')->comment('ID del departamento');
            $table->foreign('dep_id')->references('id')->on('departamentos');
            $table->unsignedBigInteger('ciu_id')->comment('ID de la ciudad');
            $table->foreign('ciu_id')->references('id')->on('ciudades');
            
            $table->bigInteger('creado_por_id')->comment('ID del que creo el registro');
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
        Schema::dropIfExists('conf_provider_sends');
    }
};
