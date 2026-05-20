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
        Schema::create('user_interoperabilities', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Nombre del usuario interoperabilidad');
            $table->string('email')->comment('Email del usuario interoperabilidad');
            $table->string('document')->comment('Documento del usuario interoperabilidad');
            $table->unsignedBigInteger('type_document_id')->comment('Tipo de documento');
            $table->foreign('type_document_id')->references('id')->on('tipos_documentos');
            $table->foreignId('dependency_id')->comment('Dependencia id')->constrained('g_d_dependencies');
            $table->text('token')->nullable();
            
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
        Schema::dropIfExists('user_interoperabilities');
    }
};
