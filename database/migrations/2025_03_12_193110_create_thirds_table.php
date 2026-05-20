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
        Schema::create('thirds', function (Blueprint $table) {
            $table->id();
            $table->string('name_social_reason_sender')->comment('Nombre o razón social remitente');
            $table->string('first_surname_legal_representative_sender')->comment('Apellido o representante legal remitente');
            $table->string('document_nit_sender')->comment('Documento o NIT remitente');
            $table->string('address_sender')->comment('Dirección remitente');
            $table->string('email_sender')->comment('Correo electrónico remitente');
            $table->string('phone_sender')->comment('Teléfono remitente');
            $table->foreignId('country_id')->constrained('countries')->comment('País remitente');
            $table->unsignedInteger('department_id')->comment('ID del departamento');
            $table->foreign('department_id')->references('id')->on('departamentos');
            $table->unsignedBigInteger('city_id')->comment('ID de la ciudad');
            $table->foreign('city_id')->references('id')->on('ciudades');
            $table->foreignId('type_person_id_sender')->constrained('type_people')->comment('Tipo de persona remitente');

            $table->bigInteger('creado_por_id');
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
        Schema::dropIfExists('thirds');
    }
};
