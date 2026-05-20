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
        Schema::create('filing_email_tos', function (Blueprint $table) {
            $table->id();

            $table->bigInteger('to_id')->comment('Id del usuario al que envia');
            $table->boolean('is_read')->default(0);
            $table->foreignId('filing_email_id')->constrained('filing_emails');

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
        Schema::dropIfExists('filing_email_tos');
    }
};
