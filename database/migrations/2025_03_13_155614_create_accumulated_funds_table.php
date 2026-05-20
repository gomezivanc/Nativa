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
        Schema::create('accumulated_funds', function (Blueprint $table) {
            $table->id();
            $table->string('number')->comment('Numero del radicado');
            $table->string('word')->nullable()->comment('Palabra clave');
            $table->foreignId('remi_desti_id')->nullable()->comment('Remitente o destinatario del documento')->constrained('thirds');
            $table->string('subject')->nullable()->comment('Asunto del radicado');
            $table->json('type_document')->nullable()->comment('Tipo de documento');

            $table->json('serie')->nullable()->comment('Serie documental');
            $table->json('subserie')->nullable()->comment('SubSerie documental');

            $table->foreignId('clasification_id')->nullable()->comment('ID de la clasificación')->constrained('exp_files_clasifications');

            // ubicacion del fondo acumulado
            $table->unsignedInteger('dep_id')->nullable()->comment('ID del departamento');
            $table->foreign('dep_id')->references('id')->on('departamentos');
            $table->unsignedBigInteger('ciu_id')->nullable()->comment('ID de la ciudad');
            $table->foreign('ciu_id')->references('id')->on('ciudades');
            $table->string('building')->nullable()->comment('Nombre del espacio fisico');
            $table->string('floor')->nullable()->comment('Numero de piso');
            $table->foreignId('file_area_id')->nullable()->comment('Id del area seleccionado: ubicacion del espacio fisico')->constrained('physical_spaces_ubications');
            $table->string('type')->nullable()->comment('Tipo');
            $table->string('rack')->nullable()->comment('Estante');
            $table->string('module')->nullable()->comment('Modulo');
            $table->string('panel')->nullable()->comment('Entrepaño');
            $table->string('box')->nullable()->comment('Caja');
            $table->foreignId('type_body_id')->nullable()->constrained('types_bodies')->comment('Tipo de cuerpo');
            $table->string('unity_conservation')->nullable()->comment('Unidad de conservación');
            $table->bigInteger('creado_por_id')->comment('Id del usuario creador');
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
        Schema::dropIfExists('accumulated_funds');
    }
};
