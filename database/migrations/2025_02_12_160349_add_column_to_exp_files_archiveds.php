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
        Schema::table('exp_files_archiveds', function (Blueprint $table) {
            $table->string('unity_conservation')->comment('Unidad de conservación')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('exp_files_archiveds', function (Blueprint $table) {
            $table->dropColumn('unity_conservation');
        });
    }
};
