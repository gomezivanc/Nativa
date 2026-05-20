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
        Schema::create('charge_doc_filings', function (Blueprint $table) {
            $table->id();
            $table->text('description')->comment('Descripción del documento');
            $table->boolean('is_public')->comment('Es público');
            $table->string('file')->nullable();
            $table->bigInteger('creado_por_id')->comment('Id de quien creo el registro');
            $table->foreignId('filing_id')->comment('ID del radicado')->constrained('filings');
            $table->json('file_detail')->nullable()->comment('Detalles de documento cargado');

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
        Schema::dropIfExists('charge_doc_filings');
    }
};
