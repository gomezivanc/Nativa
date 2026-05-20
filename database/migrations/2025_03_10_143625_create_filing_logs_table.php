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
        Schema::create('filing_logs', function (Blueprint $table) {
            $table->id();
            $table->string('action_es');
            $table->text('description_es');
            $table->string('action_en');
            $table->text('description_en');           
            $table->string('icon');
            $table->bigInteger('creado_por_id')->comment('Usuario que creo el registro');
            $table->foreignId('dependency_id')->comment('Id de la dependencia')->constrained('g_d_dependencies');
            $table->foreignId('filing_id')->comment('Id del radicado')->constrained('filings');
            $table->softDeletes();
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
        Schema::dropIfExists('filing_logs');
    }
};
