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
        Schema::table('filing_workflows', function (Blueprint $table) {
            $table->boolean('is_devolution')->comment('es Observacion de devolución')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('filing_workflows', function (Blueprint $table) {
            $table->dropColumn('is_devolution');
        });
    }
};
