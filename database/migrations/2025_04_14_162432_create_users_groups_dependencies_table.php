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
        Schema::create('users_groups_dependencies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dependency_id')->comment('Id de la dependencia')->constrained('g_d_dependencies');
            $table->foreignId('group_id')->comment('Id del grupo')->constrained('users_groups');
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
        Schema::dropIfExists('users_groups_dependencies');
    }
};
