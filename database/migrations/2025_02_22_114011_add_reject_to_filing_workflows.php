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
            $table->boolean('is_reject')->default(0)->comment('Flag de si esta devuelto el avance');
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
            $table->dropColumn('is_reject');
        });
    }
};
