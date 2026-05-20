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
        Schema::table('filings', function (Blueprint $table) {
            //
            $table->boolean('cancelation_request')->nullable()->comment('Flag para saber si esta en solicitud de anulación');
            // $table->integer('distribution_shipping_status')->nullable()->comment('Estado el cual representa que paso va de distribucion y envio (1. Pendiente por envio 2.Entregado 3.Devuelto)');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('filings', function (Blueprint $table) {
            //
            $table->dropColumn(['cancelation_request','distribution_shipping_status']);
        });
    }
};
