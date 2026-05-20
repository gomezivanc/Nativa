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
        Schema::create('historic_loans_exps', function (Blueprint $table) {
            $table->id();

            $table->text('observation')->comment('Observacion de la solicitud de prestamo');
            $table->date('return_at')->nullable()->comment('Fecha de devolución');
            $table->foreignId('exp_file_id')->comment('Id del archivo de solicitud')->constrained('exp_files');
            $table->foreignId('state_loan_id')->nullable()->comment('Id del estado de prestamo')->constrained('type_documentary_loans');
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
        Schema::dropIfExists('historic_loans_exps');
    }
};
