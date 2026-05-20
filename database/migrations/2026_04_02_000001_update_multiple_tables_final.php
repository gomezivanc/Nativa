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

        // Actualizar tabla exp_files_file_segments si existe
        if (Schema::hasTable('exp_files_file_segments')) {
            Schema::table('exp_files_file_segments', function (Blueprint $table) {
                if (!Schema::hasColumn('exp_files_file_segments', 'type_doc_id')) {
                    $table->unsignedBigInteger('type_doc_id')->nullable()
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
            $table->dropColumn(['political_description', 'website']);
        });

        Schema::table('roles', function (Blueprint $table) {
            if (Schema::hasColumn('roles', 'type_filing_id')) {
                $table->dropConstrainedForeignId('type_filing_id');
            }
        });

        if (Schema::hasTable('exp_files_file_segments')) {
            Schema::table('exp_files_file_segments', function (Blueprint $table) {
                if (Schema::hasColumn('exp_files_file_segments', 'type_doc_id')) {
                    $table->dropColumn('type_doc_id');
                }
            });
        }
    }
};
