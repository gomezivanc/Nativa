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
            $table->foreignId('current_version_id')->nullable()->constrained('dependency_historics');
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
            $table->dropColumn('current_version_id');
        });
    }
};
