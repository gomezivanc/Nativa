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
        // Agregar columnas a tabla usuarios
        Schema::table('usuarios', function (Blueprint $table) {
            if (!Schema::hasColumn('usuarios', 'charge_id')) {
                $table->foreignId('charge_id')->nullable()
                    ->constrained('charges')
                    ->cascadeOnDelete();
            }
        });

        // Actualizar tabla companies
        Schema::table('companies', function (Blueprint $table) {
            if (!Schema::hasColumn('companies', 'political_description')) {
                $table->string('political_description', 191)->nullable()
                    ->comment('Descripción política');
            }

            if (!Schema::hasColumn('companies', 'website')) {
                $table->string('website', 191)->nullable()
                    ->comment('Sitio web');
            }
        });

        // Actualizar tabla roles
        Schema::table('roles', function (Blueprint $table) {
            if (!Schema::hasColumn('roles', 'type_filing_id')) {
                $table->foreignId('type_filing_id')->nullable()
                    ->constrained('types_filings')
                    ->nullOnDelete();
            }
        });

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
                        ->comment('1 = Creación módulo terceros, 2 = Usuario por radicado');
                }
            });
        }

        // Modificar tabla charge_doc_filings
        if (Schema::hasTable('charge_doc_filings')) {
            Schema::table('charge_doc_filings', function (Blueprint $table) {
                if (!Schema::hasColumn('charge_doc_filings', 'document_type')) {
                    $table->string('document_type', 255)->nullable()
                        ->comment('Tipo de documento');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            if (Schema::hasColumn('usuarios', 'charge_id')) {
                $table->dropConstrainedForeignId('charge_id');
            }
        });

        Schema::table('companies', function (Blueprint $table) {
            if (Schema::hasColumn('companies', 'political_description')) {
                $table->dropColumn('political_description');
            }
            if (Schema::hasColumn('companies', 'website')) {
                $table->dropColumn('website');
            }
        });

        Schema::table('roles', function (Blueprint $table) {
            if (Schema::hasColumn('roles', 'type_filing_id')) {
                $table->dropConstrainedForeignId('type_filing_id');
            }
        });

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
