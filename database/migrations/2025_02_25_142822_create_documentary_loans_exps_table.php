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
        Schema::create('documentary_loans_exps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('type_requirement_id')->comment('Id del tipo de requerimiento')->constrained('type_requirements');
            $table->foreignId('type_loan_id')->comment('Id de tipo de prestamo')->constrained('type_loans');
            $table->text('observation');
            $table->foreignId('exp_file_id')->comment('Id del tipo de prestamo para el archivo')->constrained('exp_files');
            $table->bigInteger('creado_por_id')->comment('Id de quien hizo la petición');

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
        Schema::dropIfExists('documentary_loans_exps');
    }
};
