<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('filings', function (Blueprint $table) {
            //
            $table->foreignId('exp_file_id')->nullable()->comment('Id del expediente')->constrained('exp_files');
            $table->boolean('no_response_required')->nullable()->comment('Flag para saber que no requiere respuesta');
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
           
            // Eliminar la restricción de clave foránea
            $table->dropForeign(['exp_file_id']);

            // Eliminar las columnas
            $table->dropColumn(['no_response_required', 'exp_file_id']);
        });
    }
};
