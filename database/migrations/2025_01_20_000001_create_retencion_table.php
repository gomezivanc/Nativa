<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('retencion', function (Blueprint $table) {
            $table->id();

            $table->integer('papel')->nullable()->comment('Años de retención en papel');
            $table->integer('electronico')->nullable()->comment('Años de retención en formato electrónico');
            $table->integer('archivo_gestion')->nullable()->comment('Años en archivo de gestión');
            $table->integer('archivo_central')->nullable()->comment('Años en archivo central');

            $table->boolean('eliminacion')->default(0)->comment('Puede ser eliminado');
            $table->boolean('seleccion')->default(0)->comment('Puede ser seleccionado');
            $table->boolean('conservacion_total')->default(0)->comment('Conservación total');
            $table->boolean('digitalizacion_micro')->default(0)->comment('Puede ser digitalizado o microfilmado');
            $table->longText('procedimiento')->comment('Procedimiento de retención');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('retencion');
    }
};
