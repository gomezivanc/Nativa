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
        Schema::create('retencion_indices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('retencion_id')->constrained('retencion')->cascadeOnDelete();
            $table->foreignId('indice_id')->constrained('indices')->cascadeOnDelete();
            $table->boolean('obligatorio')->default(false);
            $table->boolean('es_nombre')->nullable();
            $table->integer('orden')->default(1);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('retencion_indices');
    }
};
