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
        Schema::table('physical_spaces_ubications', function (Blueprint $table) {
            $table->softDeletes();
            $table->foreignId('type_body_id')->nullable()->constrained('types_bodies')->comment('Tipo de cuerpo');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('physical_spaces', function (Blueprint $table) {
            $table->dropForeign(['type_body_id']);
            $table->dropColumn('type_body_id');
        });
    }
};
