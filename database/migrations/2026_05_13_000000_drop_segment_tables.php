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
        Schema::dropIfExists('exp_files_file_segments');
        Schema::dropIfExists('exp_filings_file_segments');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Las tablas de segmentos lógicos no se restauran automáticamente
        // porque su creación original depende de migraciones históricas.
    }
};
