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
        Schema::create('exp_files_dependencies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exp_file_id')->comment('ID del expediente')->constrained('exp_files');
            $table->foreignId('dependency_id')->constrained('g_d_dependencies');
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
        Schema::dropIfExists('exp_files_dependencies');
    }
};
