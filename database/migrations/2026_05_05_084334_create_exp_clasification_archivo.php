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
        Schema::create('exp_clasification_archive', function (Blueprint $table) {
            $table->id();
            $table->string('name_es');
            $table->string('name_en');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('exp_files', function (Blueprint $table) {
            $table->foreign('archive_id')
                ->references('id')
                ->on('exp_clasification_archive');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('exp_files', function (Blueprint $table) {
            if (Schema::hasColumn('exp_files', 'archive_id')) {
                $table->dropForeign(['archive_id']);
            }
        });

        Schema::dropIfExists('exp_clasification_archive');
    }
};
