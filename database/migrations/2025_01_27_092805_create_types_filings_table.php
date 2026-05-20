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
        Schema::create('types_filings', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('code',255)->comment('Codigo de tipo de radicado');
            $table->string('name',255)->comment('Nombre de tipo de radicado');
            $table->text('description')->comment('Descripción de tipo de radicado');
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
        Schema::dropIfExists('types_filings');
    }
};
