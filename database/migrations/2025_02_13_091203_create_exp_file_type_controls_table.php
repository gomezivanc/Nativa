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
        Schema::create('exp_file_type_controls', function (Blueprint $table) {
            $table->id();
            $table->string('name_es')->comment('Nombre del tipo de control');
            $table->string('name_en')->comment('Nombre del tipo de control');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('exp_file_type_controls');
    }
};
