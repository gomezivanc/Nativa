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
        Schema::table('exp_files_files', function (Blueprint $table) {
            $table->foreignId('reference_cr_id')->nullable()->comment('Id de la referencia crusada')->constrained('exp_files_referencecrusades');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('exp_files_files', function (Blueprint $table) {
            $table->dropColumn('reference_cr_id');
        });
    }
};
