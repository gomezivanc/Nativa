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
        Schema::create('exp_files_file_segments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('file_id')
                ->constrained('exp_files_files')
                ->cascadeOnDelete();

            $table->foreignId('type_doc_id')
                ->nullable()
                ->constrained('exp_files_type_docs')
                ->nullOnDelete();

            $table->unsignedInteger('page_start');
            $table->unsignedInteger('page_end');

            $table->text('observation')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('exp_files_file_segments');
    }
};
