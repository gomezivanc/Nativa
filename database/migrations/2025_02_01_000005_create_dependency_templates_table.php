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
        Schema::create('dependency_templates', function (Blueprint $table) {
            $table->id();

            $table->foreignId('id_template')
                ->constrained('payroll_management')
                ->cascadeOnDelete();

            $table->foreignId('id_dependency')
                ->constrained('g_d_dependencies');

            $table->text('observation')->nullable()->comment('Observación');

            $table->string('code', 30)->nullable()->comment('Código');

            $table->string('version', 30)->nullable()->comment('Versión');

            $table->string('name', 110)->nullable()->comment('Nombre');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dependency_templates');
    }
};
