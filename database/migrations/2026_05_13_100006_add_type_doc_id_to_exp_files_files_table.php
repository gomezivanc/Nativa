<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('exp_files_files', function (Blueprint $table) {
            $table->foreignId('type_doc_id')
                  ->nullable()
                  ->after('id')
                  ->comment('Tipo de documento')
                  ->constrained('exp_files_type_docs');
        });
    }

    public function down()
    {
        Schema::table('exp_files_files', function (Blueprint $table) {
            $table->dropForeign(['type_doc_id']);
            $table->dropColumn('type_doc_id');
        });
    }
};
