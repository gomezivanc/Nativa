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
        Schema::table('exp_files_files', function (Blueprint $table) {
            $table->integer('num_pages')
                  ->nullable()
                  ->after('file')
                  ->comment('Número de páginas del documento');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exp_files_files', function (Blueprint $table) {
            $table->dropColumn('num_pages');
        });
    }
};
