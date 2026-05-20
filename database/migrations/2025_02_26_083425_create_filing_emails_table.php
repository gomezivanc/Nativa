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
        Schema::create('filing_emails', function (Blueprint $table) {
            $table->id();

            $table->bigInteger('from_id')->comment('Id del usuario');
            $table->string('subject')->nullable()->comment('Asunto del correo');
            $table->text('body')->comment('Cuerpo del correo');
            
            $table->foreignId('filing_id')->nullable()->comment('Id del radicado del correo')->constrained('filings');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('filing_emails');
    }
};
