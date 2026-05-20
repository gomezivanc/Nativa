<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('exp_files_support_types', function (Blueprint $table) {
            $table->id();
            $table->string('name_es')->comment('Nombre de tipo de soporte español');
            $table->string('name_en')->comment('Nombre de tipo de soporte ingles');
            $table->timestamps();
        });

        if (Schema::hasTable('charge_doc_filings')) {
            Schema::table('charge_doc_filings', function (Blueprint $table) {
                if (!Schema::hasColumn('charge_doc_filings', 'support_type_id')) {
                    $table->foreignId('support_type_id')->nullable()
                        ->constrained('exp_files_support_types');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasTable('charge_doc_filings')) {
            Schema::table('charge_doc_filings', function (Blueprint $table) {
                if (Schema::hasColumn('charge_doc_filings', 'support_type_id')) {
                    $table->dropConstrainedForeignId('support_type_id');
                }
            });
        }

        Schema::dropIfExists('exp_files_support_types');
    }
};
