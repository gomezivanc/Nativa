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
        Schema::create('expediente_indices', function (Blueprint $table) {
            $table->id();            
            $table->foreignId('exp_id')->constrained('exp_files')->cascadeOnDelete();
            $table->foreignId('indice_id')->constrained('indices')->cascadeOnDelete();
            $table->string('valor', 500)->nullable();
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
        Schema::dropIfExists('expediente_indices');
    }
};
