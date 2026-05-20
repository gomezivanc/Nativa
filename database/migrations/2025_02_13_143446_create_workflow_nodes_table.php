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
        Schema::create('workflow_nodes', function (Blueprint $table) {
            $table->id();
            $table->json('node_data')->comment('Datos de nodo');

            $table->boolean('is_parallel_flow')->comment('Es un flujo paralelo?')->default(0);
            $table->string('text_conditional')->nullable()->comment('Condicional del flujo paralelo');

            $table->boolean('conditional_true')->nullable()->comment('Nodo perteneciente a un condicional?')->default(0);
            $table->boolean('conditional_true_yes')->nullable()->comment('Nodo perteneciente a un condicional de si')->default(0);

            $table->boolean('is_finish')->default(0)->comment('Flag de finaliza el flujo');
            $table->foreignId('conditional_wf_node_id')->nullable()->comment('Node al que pertence el condicional')->constrained('workflow_nodes');
            $table->foreignId('last_node')->nullable()->comment('(solo nodos de condicional) Nodo anterior')->constrained('workflow_nodes');
            $table->foreignId('next_node')->nullable()->comment('(solo nodos de condicional) Nodo siguiente')->constrained('workflow_nodes');
            $table->foreignId('workflow_id')->comment('Id de workflow')->constrained('workflows');
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
        Schema::dropIfExists('workflow_nodes');
    }
};
