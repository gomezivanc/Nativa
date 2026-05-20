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
        Schema::create('dependency_historics', function (Blueprint $table) {
            $table->id();
            $table->json('data_json')->comment('Json del registro');
            $table->foreignId('gd_dependency_id')->comment('Id de la dependencia')->constrained('g_d_dependencies');
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
        Schema::dropIfExists('dependency_historics');
    }
};
