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
        Schema::create('physical_spaces_ubications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('physical_space_id')->comment('Edificio Id')->constrained('physical_spaces');

            $table->integer('floor')->nullable()->comment('Piso');
            $table->string('file_area')->nullable()->comment('Area del archivo');
            $table->integer('rack')->nullable()->comment('Estante');
            $table->integer('module')->nullable()->comment('Modulo');
            $table->integer('panel')->nullable()->comment('Entrepaño');
            $table->integer('box')->nullable()->comment('Caja');
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
        Schema::dropIfExists('physical_spaces_ubications');
    }
};
