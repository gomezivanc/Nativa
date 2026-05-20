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
        Schema::create('exp_files_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('type_doc_id')->comment('Tipo de documento')->constrained('exp_files_type_docs');
            $table->date('date')->comment('Fecha de documento');
            $table->text('description')->comment('Descripción de documento');
            $table->boolean('is_public')->comment('es publico');
            $table->json('file_detail')->nullable()->comment('Detalles de documento cargado');
            $table->string('file')->nullable();
            $table->foreignId('exp_file_id')->comment('ID del expediente')->constrained('exp_files');
            $table->string('token')->nullable()->comment('Valor de huella');

            $table->bigInteger('creado_por_id')->comment('Id de quien creo el registro');
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
        Schema::dropIfExists('exp_files_files');
    }
};
