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
        // Modificar tabla charge_doc_filings
        if (Schema::hasTable('charge_doc_filings')) {
            Schema::table('charge_doc_filings', function (Blueprint $table) {
                if (!Schema::hasColumn('charge_doc_filings', 'document_type')) {
                    $table->string('document_type', 255)->nullable()
                        ->comment('Tipo de documento');
                }
            });
        }

        // Modificar tabla thirds
        if (Schema::hasTable('thirds')) {
            Schema::table('thirds', function (Blueprint $table) {
                if (!Schema::hasColumn('thirds', 'type_document_id')) {
                    $table->foreignId('type_document_id')->nullable()
                        ->constrained('tipos_documentos')
                        ->nullOnDelete();
                }

                if (!Schema::hasColumn('thirds', 'creation_type')) {
                    $table->unsignedBigInteger('creation_type')->nullable()
                        ->comment('1 = Creación módulo terceros, 2 = Usuario por radicado, 3 = Usuario por Respuesta');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('thirds')) {
            Schema::table('thirds', function (Blueprint $table) {
                if (Schema::hasColumn('thirds', 'type_document_id')) {
                    $table->dropConstrainedForeignId('type_document_id');
                }
                if (Schema::hasColumn('thirds', 'creation_type')) {
                    $table->dropColumn('creation_type');
                }
            });
        }

        if (Schema::hasTable('charge_doc_filings')) {
            Schema::table('charge_doc_filings', function (Blueprint $table) {
                if (Schema::hasColumn('charge_doc_filings', 'document_type')) {
                    $table->dropColumn('document_type');
                }
            });
        }
    }
};
