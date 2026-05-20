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
        Schema::create('exp_files_archiveds', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('dep_id')->comment('ID del departamento');
            $table->foreign('dep_id')->references('id')->on('departamentos');
            $table->unsignedBigInteger('ciu_id')->comment('ID de la ciudad');
            $table->foreign('ciu_id')->references('id')->on('ciudades');
            $table->string('building')->comment('Nombre del espacio fisico');
            $table->string('floor')->comment('Numero de piso');
            $table->foreignId('file_area_id')->nullable()->comment('Id del area seleccionado: ubicacion del espacio fisico')->constrained('physical_spaces_ubications');
            $table->string('type')->nullable()->comment('Tipo');
            $table->string('rack')->nullable()->comment('Estante');
            $table->string('module')->nullable()->comment('Modulo');
            $table->string('panel')->nullable()->comment('Entrepaño');
            $table->string('box')->nullable()->comment('Caja');
            $table->foreignId('type_body_id')->nullable()->constrained('types_bodies')->comment('Tipo de cuerpo');
            $table->foreignId('exp_file_id')->nullable()->constrained('exp_files')->comment('Expedientes');

            $table->bigInteger('creado_por_id')->comment('ID del que archivo');
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
        Schema::dropIfExists('exp_files_archiveds');
    }
};
