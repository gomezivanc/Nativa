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
        Schema::create('workflow_edges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workflow_id')->constrained('workflows');
            $table->json('edge_data')->comment('Datos de la linea entre nodos');
            $table->foreignId('node_id')->nullable()->comment('Id del nodo nodos')->constrained('workflow_nodes');
            $table->foreignId('second_node_id')->comment('Id del nodo nodos')->constrained('workflow_nodes');
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
        Schema::dropIfExists('workflow_edges');
    }
};
