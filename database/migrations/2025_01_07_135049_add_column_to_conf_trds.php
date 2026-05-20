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
        Schema::table('conf_trds', function (Blueprint $table) {
            $table->string('serie')->comment('Celda serie')->nullable();
            $table->string('subserie')->comment('Celda subserie')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('conf_trds', function (Blueprint $table) {
            $table->dropColumn('serie');
            $table->dropColumn('subserie');
        });
    }
};
