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
        Schema::create('distribution_units', function (Blueprint $table) {
            $table->id();

            $table->foreignId('id_dependency')
                ->constrained('g_d_dependencies')
                ->cascadeOnDelete();

            $table->string('name', 100)->nullable()->comment('Nombre de la unidad de distribución');

            $table->tinyInteger('central_bool')->nullable()->comment('Es central');

            $table->unsignedInteger('id_mail')->nullable()->comment('ID de configuración de correo');

            $table->text('observation')->nullable()->comment('Observación');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('distribution_units');
    }
};
