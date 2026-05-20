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
        Schema::create('users_groups', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Nombre del grupo de usuario');
            $table->foreignId('g_d_dependency_id')->comment('Dependencia afiliada al grupo')->constrained('g_d_dependencies');
            $table->bigInteger('creado_por_id')->comment('Usuario creador del registro');
            $table->timestamps();
            $table->softDeletes()->comment('Fecha de eliminación');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users_groups');
    }
};
