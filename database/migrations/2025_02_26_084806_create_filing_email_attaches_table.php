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
        Schema::create('filing_email_attaches', function (Blueprint $table) {
            $table->id();

            $table->foreignId('filing_email_id')->constrained('filing_emails');
            $table->string('path')->comment('url del archivo adjunto');
            $table->string('file_name')->comment('Nombre del archivo');

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
        Schema::dropIfExists('filing_email_attaches');
    }
};
