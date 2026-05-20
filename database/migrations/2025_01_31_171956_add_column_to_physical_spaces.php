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
        Schema::table('physical_spaces', function (Blueprint $table) {
            $table->bigInteger('creado_por_id')->comment('Id del usuario que lo crea');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('physical_spaces', function (Blueprint $table) {
            $table->dropColumn('creado_por_id');
        });
    }
};
