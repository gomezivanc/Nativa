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
        Schema::create('serie', function (Blueprint $table) {
            $table->id();

            $table->string('code', 50)->comment('Código de la serie');
            $table->string('name', 255)->comment('Nombre de la serie');

            $table->foreignId('dependency_id')
                ->constrained('g_d_dependencies')
                ->cascadeOnDelete();

            $table->foreignId('retencion_id')
                ->nullable()
                ->constrained('retencion')
                ->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('serie');
    }
};
