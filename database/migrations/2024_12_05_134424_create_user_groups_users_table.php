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
        Schema::create('user_groups_users', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->comment('ID del usuario');
            $table->foreignId('users_group_id')->comment('Grupo al que pertenece el usuario')->constrained('users_groups');
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
        Schema::dropIfExists('user_groups_users');
    }
};
