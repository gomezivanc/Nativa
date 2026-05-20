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
        Schema::create('conf_services_providers', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Nombre del servicio proveedor');
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
        Schema::dropIfExists('conf_services_providers');
    }
};
