<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCiudadesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ciudades', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('id_departamento')->comment('Id del departamento')->unsigned();
            $table->string('nombre',255)->comment('Nombre de la ciudad');
            $table->bigInteger('codigo_dane')->comment('Codigo dane de la ciudad')->nullable();
            $table->bigInteger('codigo_divipole')->comment('Codigo divipole de la ciudad')->nullable();
            $table->boolean('estado')->comment('Estado del departamento')->default(1);
            $table->timestamps();
            $table->foreign('id_departamento')->references('id')->on('departamentos');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ciudades');
    }
}
