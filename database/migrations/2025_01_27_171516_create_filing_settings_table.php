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
        Schema::create('filing_settings', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->integer('dependency_length')->comment('Campo para indicar la logintegerud de la depencia');
            $table->foreignId('filling_structure_id')->comment('ID del expediente')->constrained('filing_structures');
            $table->integer('consecutive_length')->comment('Campo para indicar el tamaño del radicado');
            $table->bigInteger('creado_por_id')->comment('Id del usuario creador');
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
        Schema::dropIfExists('filing_settings');
    }
};
