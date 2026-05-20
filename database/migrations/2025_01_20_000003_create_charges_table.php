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
        Schema::create('charges', function (Blueprint $table) {
            $table->id();

            $table->foreignId('id_regional')
                ->constrained('regionals')
                ->cascadeOnDelete();

            $table->foreignId('id_dependency')
                ->constrained('g_d_dependencies')
                ->cascadeOnDelete();

            $table->string('cargo', 100)->nullable()->comment('Nombre del cargo');

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
        Schema::dropIfExists('charges');
    }
};
