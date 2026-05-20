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
        Schema::table('dependency_historics', function (Blueprint $table) {
            $table->boolean('is_approval')->nullable()->comment('Indica si esta aprobada la versión');
            $table->text('observation')->nullable()->comment('Observación');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('dependency_historics', function (Blueprint $table) {
            $table->dropColumn('is_approval');
            $table->dropColumn('observation');
        });
    }
};
