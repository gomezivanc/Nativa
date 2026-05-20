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
        Schema::create('exp_files_type_docs', function (Blueprint $table) {
            $table->id();
            $table->string('name_es')->comment('Nombre de tipo documental español');
            $table->string('name_en')->comment('Nombre de tipo documental ingles');
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
        Schema::dropIfExists('exp_files_type_docs');
    }
};
