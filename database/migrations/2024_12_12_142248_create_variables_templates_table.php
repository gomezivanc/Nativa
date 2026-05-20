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
        Schema::create('variables_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Nombre de la variable');
            $table->text('description')->nullable()->comment('Descripción de la variable');

            $table->bigInteger('creado_por_id');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('variables_templates');
    }
};
