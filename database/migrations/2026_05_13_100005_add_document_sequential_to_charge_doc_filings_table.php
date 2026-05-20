<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('charge_doc_filings', function (Blueprint $table) {
            $table->string('document_sequential', 50)
                  ->nullable()
                  ->after('file')
                  ->comment('Consecutivo del documento');
        });
    }

    public function down()
    {
        Schema::table('charge_doc_filings', function (Blueprint $table) {
            $table->dropColumn('document_sequential');
        });
    }
};
