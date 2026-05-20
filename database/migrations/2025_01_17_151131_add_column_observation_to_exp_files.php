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
        Schema::table('exp_files', function (Blueprint $table) {
            $table->text('close_observation')->nullable()->comment('Observacion de cierre del expediente');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('exp_files', function (Blueprint $table) {
            $table->dropColumn('close_observation');
        });
    }
};
