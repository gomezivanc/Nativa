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
        Schema::table('g_d_dependencies', function (Blueprint $table) {
            //
            // $table->dropForeign(['ciu_id']);
            // $table->dropForeign(['dep_id']);
         
        });
        Schema::table('g_d_dependencies', function (Blueprint $table) {               
            // $table->dropColumn('ciu_id');
            // $table->dropColumn('dep_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('g_d_dependencies', function (Blueprint $table) {
            //
        });
    }
};
