<?php

use Brick\Math\BigInteger;
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
        Schema::create('exp_files', function (Blueprint $table) {
            $table->id();
            $table->string('number')->comment('Numero del expediente');
            $table->string('name')->comment('Nombre del expediente');
            $table->string('date_init')->nullable()->comment('Fecha de inicio del expediente');
            $table->boolean('exist_p')->default(0)->comment('Existe fisicamente?');
            $table->string('book')->nullable()->comment('Especificación Libro');
            $table->string('file_box')->nullable()->comment('Caja de archivo');
            $table->string('shelf')->nullable()->comment('Estante');

            $table->boolean('sub_exp')->default(0)->comment('Es sub expediente');
            $table->foreignId('clasification_id')->nullable()->comment('ID de la clasificación')->constrained('exp_files_clasifications');
            $table->unsignedBigInteger('archive_id')->nullable()->comment('ID de archivo');
                // exp_files_archiveds
            $table->text('description')->nullable()->comment('Descripción');
            $table->json('serie')->nullable();
            $table->json('subserie')->nullable();

            // responsable
            $table->foreignId('dependency_id')->nullable()->constrained('g_d_dependencies');
            $table->BigInteger('responsible_id')->nullable()->comment('Responsable del expediente: Modulo de usuarios');
            $table->boolean('add_subfile')->default(0)->comment('Agregar un subexpediente?');
            $table->foreignId('sub_exp_id')->nullable()->constrained('exp_files')->comment('Id al expediente padre');
            $table->bigInteger('creado_por_id');

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
        Schema::dropIfExists('exp_files');
    }
};
