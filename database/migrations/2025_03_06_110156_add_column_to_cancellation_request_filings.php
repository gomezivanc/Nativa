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
        Schema::table('cancellation_request_filings', function (Blueprint $table) {
            //
            $table->bigInteger('creado_por_id')->comment('Id de quien hizo la petición')->nullable();
            $table->text('observation_response')->comment('Observación de respuesta')->nullable();
            $table->bigInteger('respuesto_por_id')->comment('Id quien hizo la repsuesta de la anulación')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('cancellation_request_filings', function (Blueprint $table) {
            //
            $table->dropColumn(['creado_por_id','observation_response','respuesto_por_id']);

        });
    }
};
