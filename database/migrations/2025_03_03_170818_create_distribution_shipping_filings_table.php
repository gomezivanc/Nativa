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
        Schema::create('distribution_shipping_filings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('regional_id')->comment('Id de la regional')->constrained('regionals');
            $table->foreignId('conf_provider_send_id')->comment('Id del proveedor')->constrained('conf_provider_sends');
            $table->foreignId('conf_services_provider_id')->comment('Id de servicio activo ')->constrained('conf_services_providers');
            $table->integer('distribution_shipping_status')->nullable()->comment('Estado el cual representa que paso va de distribucion y envio (1. Pendiente por envio 2.Entregado 3.Devuelto)');
            $table->string('tracking_number')->comment('Numero de guia de envio');
            $table->text('observatio_send')->comment('Observación de envio');
            $table->string('supporting_document')->comment('Documento de soporte para el envio')->nullable();
            $table->softDeletes();


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
        Schema::dropIfExists('distribution_shipping_filings');
    }
};
