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
            $table->boolean('is_pending_close')->comment('Estado booleando de si esta pendiente de cerrar el expediente')->default(0);
            $table->bigInteger('deleted_by')->comment('ID de la persona que elimino')->nullable();
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
            $table->dropColumn('is_pending_close');
            $table->dropColumn('deleted_by');
        });
    }
};
