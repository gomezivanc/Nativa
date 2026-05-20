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
            $table->boolean('is_end_wk')->default(0)->comment('Flag de finalizado el flujo de trabajo');
            $table->foreignId('current_node_id')->nullable()->constrained('workflow_nodes');
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
            $table->dropColumn('is_end_wk');
            $table->dropColumn('current_node_id');
        });
    }
};
