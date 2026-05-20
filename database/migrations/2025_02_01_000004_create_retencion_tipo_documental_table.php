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
        Schema::create('retencion_tipo_documental', function (Blueprint $table) {
            $table->id();

            $table->foreignId('retencion_id')
                ->constrained('retencion')
                ->cascadeOnDelete();

            $table->foreignId('tipo_documental_id')
                ->constrained('exp_files_type_docs')
                ->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('retencion_tipo_documental');
    }
};
