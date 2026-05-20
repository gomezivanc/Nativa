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
        Schema::table('exp_files_files', function (Blueprint $table) {
            $table->dropForeign(['type_doc_id']);
            $table->dropColumn('type_doc_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('exp_files_files', function (Blueprint $table) {
            $table->foreignId('type_doc_id')
                ->constrained('exp_files_type_docs');
        });
    }
};
