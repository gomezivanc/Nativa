<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('response_templates', function (Blueprint $table) {
            $table->id();

            $table->foreignId('third_id')
                ->constrained('thirds')
                ->cascadeOnDelete();

            $table->foreignId('payroll_id')
                ->nullable()
                ->constrained('payroll_management')
                ->nullOnDelete();

            $table->foreignId('filings_id')
                ->constrained('filings')
                ->cascadeOnDelete();

            $table->string('template_url', 191)->nullable()->comment('URL de la plantilla');

            $table->tinyInteger('state')->nullable()->default(1)
                ->comment('1=Plantilla asociada, 2=Plantilla editada, 3=Firmando, 4=Firmado, 5=Envío respuesta');

            $table->dateTime('date_acuse')->nullable()->comment('Fecha del acuse');

            $table->dateTime('transfer_date')->nullable()->comment('Fecha de transferencia');

            $table->foreignId('id_charge_doc_accusation')->nullable()
                ->constrained('charge_doc_filings')
                ->nullOnDelete();

            $table->foreignId('id_elabora')
                ->default(1)
                ->constrained('usuarios')
                ->cascadeOnDelete();

            $table->foreignId('id_revisa')
                ->nullable()
                ->constrained('usuarios')
                ->nullOnDelete();

            $table->foreignId('id_aprueba')
                ->nullable()
                ->constrained('usuarios')
                ->nullOnDelete();

            $table->tinyInteger('estado_revisa')->nullable()->comment('Estado de revisión');
            $table->tinyInteger('estado_aprueba')->nullable()->comment('Estado de aprobación');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('response_templates');
    }
};
