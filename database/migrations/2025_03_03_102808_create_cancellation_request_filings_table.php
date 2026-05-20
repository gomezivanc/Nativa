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
        Schema::create('cancellation_request_filings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('filing_id')->comment('Id del radicado')->constrained('filings');
            $table->text('request_observation')->comment('Observacion de la anulación');
            $table->boolean('request_status')->comment('Estado de la solicitud')->nullable();
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
        Schema::dropIfExists('cancellation_request_filings');
    }
};
