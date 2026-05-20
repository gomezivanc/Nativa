<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('exp_files_files', function (Blueprint $table) {

            $table->foreignId('support_type_id')
                  ->nullable()
                  ->after('type_doc_id')
                  ->comment('Tipo de soporte')
                  ->constrained('exp_files_support_types');

            $table->string('document_sequential', 50)
                  ->nullable()
                  ->after('support_type_id')
                  ->comment('Consecutivo del documento');
        });
    }

    public function down()
    {
        Schema::table('exp_files_files', function (Blueprint $table) {

            $table->dropForeign(['support_type_id']);
            $table->dropColumn('support_type_id');

            $table->dropColumn('document_sequential');
        });
    }
};
