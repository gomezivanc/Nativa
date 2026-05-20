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
            $table->tinyInteger('state_transfer')->default(0)->comment('1: pendiente, 2: transferido 0: ninguna accion, 3: rechazado');
            $table->text('observation_transfer')->nullable()->comment('Observacion de transferencia');
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
            $table->dropColumn('state_transfer');
            $table->dropColumn('observation_transfer');
        });
    }
};
