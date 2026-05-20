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
        Schema::create('filing_workflows', function (Blueprint $table) {
            $table->id();
            $table->foreignId('filing_id')->comment('Id del radicado estandar')->constrained('filings');
            $table->foreignId('node_id')->comment('Id del nodo que se avanzo')->constrained('workflow_nodes');
            $table->text('observation')->comment('Observacion al momento de avanzar');
            $table->bigInteger('creador_por_id');
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
        Schema::dropIfExists('filing_workflows');
    }
};
