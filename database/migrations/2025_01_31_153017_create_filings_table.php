<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('filings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('types_filings_id')->nullable()->comment('Tipo de radicado')->constrained('types_filings')->nullOnDelete();
            $table->unsignedBigInteger('filling_origin')->nullable()->comment('Radicado de origen');
            $table->date('document_date')->nullable()->comment('Fecha de radicado');
            $table->foreignId('typeProcess_id')->nullable()->comment('Tipo de procedimiento')->constrained('type_of_procedure')->nullOnDelete();
            $table->foreignId('clasification_id')->nullable()->comment('ID de la clasificación')->constrained('exp_files_clasifications');

            $table->foreignId('dependency_id')->nullable()->comment('Dependencia responsable')->constrained('g_d_dependencies')->nullOnDelete();
            $table->unsignedBigInteger('official_id')->nullable()->comment('Funcionario responsable');
            $table->unsignedBigInteger('transfer_status')->nullable()->comment('Estado de transferencia');
            $table->dateTime('transfer_date')->nullable()->comment('Fecha de transferencia');

            $table->boolean('sending_mail')->comment('Envío de correo')->default(0);
            $table->unsignedBigInteger('filed_response')->nullable()->comment('1 = Correo electrónico, 2 = Correo físico');

            $table->boolean('serie_bool')->comment('Indicador para el número de serie')->default(0);
            $table->json('serie')->comment('Serie')->nullable();
            $table->json('sub_serie')->comment('Sub serie')->nullable();

            $table->foreignId('document_type_id')->nullable()->comment('Tipo de documental')->constrained('exp_files_type_docs')->nullOnDelete();
            $table->foreignId('type_document_id')->nullable()->comment('Tipo de documento')->constrained('tipos_documentos')->nullOnDelete();
            $table->foreignId('reception_medium_id')->nullable()->comment('Medio de recepción de documento')->constrained('reception_media')->nullOnDelete();
            $table->foreignId('priority_id')->nullable()->comment('Prioridad del radicado')->constrained('priorities')->nullOnDelete();
            $table->text('subject')->nullable()->comment('Asunto del radicado');
            $table->string('ias_filed', 100)->nullable()->comment('IAS radicado');
            $table->date('expiration_date')->nullable()->comment('Fecha de vencimiento del radicado');
            $table->integer('remaining_days')->nullable()->comment('Días restantes');
            $table->integer('number_pages')->nullable()->comment('Número de folios');
            $table->text('annex_description')->nullable()->comment('Descripción del anexo');
            $table->text('observation')->nullable()->comment('Observación del radicado');
            // $table->string('distribution_shipping_status')->nullable()->comment('Estado de distribución y envío');
            $table->integer('distribution_shipping_status')->nullable()->comment('Estado el cual representa que paso va de distribucion y envio (1. Pendiente por envio 2.Entregado 3.Devuelto 4.traslado a correspondencia');
            $table->foreignId('distribution_id_filing')->nullable()->comment('Unidad de distribución')->constrained('distribution_units')->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger('creado_por_id')->nullable()->comment('Id de quien creó el registro');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('filings');
    }
};
