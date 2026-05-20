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
        Schema::create('manual_usuarios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('archivo_nombre')->nullable();
            $table->text('archivo')->nullable();

            $table->bigInteger("creado_por_id");
            $table->timestamps();
            $table->softDeletes()->comment('Fecha de eliminación');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('manual_usuarios');
    }
};
