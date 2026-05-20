<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('copy_filing', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_filing')->constrained('filings')->cascadeOnDelete();
            $table->foreignId('id_official')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->foreignId('id_unitidis')->nullable()->constrained('distribution_units')->cascadeOnDelete();
            $table->string('observation', 255)->nullable();
            $table->tinyInteger('estado')->default(1);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('copy_filing');
    }
};
