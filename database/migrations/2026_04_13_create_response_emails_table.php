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
        Schema::create('response_emails', function (Blueprint $table) {
            $table->id();

            $table->foreignId('response_template_id')
                ->constrained('response_templates')
                ->cascadeOnDelete();

            $table->string('email')->comment('Email al que se envió');
            $table->enum('status', ['success', 'failed', 'bounced', 'pending'])->default('pending')->comment('Estado del envío');
            $table->text('error_message')->nullable()->comment('Mensaje de error si falló');
            $table->timestamp('sent_at')->nullable()->comment('Fecha de envío');
            $table->timestamp('bounced_at')->nullable()->comment('Fecha del rechazo/rebote');

            $table->timestamps();
            $table->softDeletes();

            $table->index(['response_template_id', 'email']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('response_emails');
    }
};
