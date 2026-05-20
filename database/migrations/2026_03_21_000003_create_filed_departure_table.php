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
        Schema::create('filed_departure', function (Blueprint $table) {
            $table->id();

            $table->foreignId('filings_id')
                ->constrained('filings')
                ->cascadeOnDelete();

            $table->string('departure_filing', 30)->comment('Número de radicado de salida');

            $table->foreignId('id_response_template')
                ->constrained('response_templates')
                ->cascadeOnDelete();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('filed_departure');
    }
};
