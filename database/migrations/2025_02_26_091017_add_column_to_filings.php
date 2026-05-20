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
            $table->boolean('finished')->comment('Finalizado bandera')->nullable();
            $table->text('finish_observation')->comment('Observación del porque se finalizo')->nullable();
            $table->dateTime('finish_date')->nullable();
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
            $table->dropColumn(['finished','finish_observation','finish_date']);
        });
    }
};
