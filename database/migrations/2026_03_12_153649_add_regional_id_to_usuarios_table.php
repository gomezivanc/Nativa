<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('usuarios', function (Blueprint $table) {

            $table->foreignId('regional_id')
                  ->nullable()
                  ->after('dependency_id')
                  ->comment('sede a la que pertenece el usuario')
                  ->constrained('regionals');
        });
    }

    public function down()
    {
        Schema::table('usuarios', function (Blueprint $table) {

            $table->dropForeign(['regional_id']);
            $table->dropColumn('regional_id');

        });
    }
};
