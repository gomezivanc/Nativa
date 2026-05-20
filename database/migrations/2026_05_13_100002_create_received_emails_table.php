<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('received_emails', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mail_config_id')->nullable()->constrained('mail_configs')->cascadeOnDelete();
            $table->string('gmail_message_id', 100)->unique();
            $table->string('sender')->nullable();
            $table->text('subject')->nullable();
            $table->longText('body_text')->nullable();
            $table->json('attachments')->nullable();
            $table->tinyInteger('has_attachments')->nullable();
            $table->dateTime('received_at')->nullable();
            $table->tinyInteger('sugerencia_ia')->nullable();
            $table->string('filing_number', 30)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('received_emails');
    }
};
