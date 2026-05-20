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
        Schema::create('exp_files_accesses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('type_control_id')->comment('Tipo de acceso')->constrained('exp_file_type_controls');
            $table->foreignId('exp_file_id')->comment('Expediente id')->constrained('exp_files');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('exp_files_accesses');
    }
};
