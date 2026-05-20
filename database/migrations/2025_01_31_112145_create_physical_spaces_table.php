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
        Schema::create('physical_spaces', function (Blueprint $table) {
            $table->id();
            $table->string('name',80)->comment('Nombre del edificio');
            $table->unsignedInteger('dep_id')->comment('ID del departamento');
            $table->foreign('dep_id')->references('id')->on('departamentos');
            $table->unsignedBigInteger('ciu_id')->comment('ID de la ciudad');
            $table->foreign('ciu_id')->references('id')->on('ciudades');

            // $table->integer('floor')->comment('Piso');
            // $table->string('file_area')->comment('Area del archivo');
            // $table->integer('rack')->comment('Estante');
            // $table->integer('module')->comment('Modulo');
            // $table->integer('panel')->comment('Entrepaño');
            // $table->integer('box')->comment('Caja');
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
        Schema::dropIfExists('physical_spaces');
    }
};
