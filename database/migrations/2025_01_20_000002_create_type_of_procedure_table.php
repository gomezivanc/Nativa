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
        Schema::create('type_of_procedure', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255)->comment('Nombre del tipo de procedimiento');
            $table->integer('response_time')->comment('Tiempo de respuesta en días');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('type_of_procedure');
    }
};
