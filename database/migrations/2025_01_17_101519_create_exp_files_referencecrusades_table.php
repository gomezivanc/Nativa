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
        Schema::create('exp_files_referencecrusades', function (Blueprint $table) {
            $table->id();
            $table->string('name_middle')->comment('Nombre medio');
            $table->string('quantity')->comment('Cantidad');
            $table->string('anex')->comment('Anexo');
            $table->string('ubication')->comment('Ubicación');
            $table->foreignId('exp_file_id')->nullable('Id del expediente')->constrained('exp_files');
            $table->bigInteger('creado_por_id')->comment('Id de quien lo creo');
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
        Schema::dropIfExists('exp_files_referencecrusades');
    }
};
