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
        Schema::create('filing_exp_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('filing_id')->comment('Id del radicado ')->constrained('filings');
            $table->foreignId('exp_file_id')->comment('Id del expediente')->constrained('exp_files');
            $table->bigInteger('creado_por_id')->comment('Usuario que creo el registro');
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
        Schema::dropIfExists('filing_exp_files');
    }
};
