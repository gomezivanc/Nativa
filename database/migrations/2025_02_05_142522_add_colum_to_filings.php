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
        Schema::table('filings', function (Blueprint $table) {            
            $table->string('filing_number',30)->nullable();
            $table->string('name_social_reason_sender')->nullable()->comment('Nombre o razón social remitente');
            $table->string('first_surname_legal_representative_sender')->nullable()->comment('Apellido o representante legal remitente');
            $table->string('document_nit_sender')->nullable()->comment('Documento o NIT remitente');
            $table->string('address_sender')->nullable()->comment('Dirección remitente');
            $table->string('email_sender')->nullable()->comment('Correo electrónico remitente');
            $table->string('phone_sender')->nullable()->comment('Teléfono remitente');
            $table->foreignId('country_id')->nullable()->constrained('countries')->nullOnDelete()->comment('País remitente');
            $table->unsignedInteger('department_id')->nullable()->comment('ID del departamento');
            $table->foreign('department_id')->references('id')->on('departamentos');
            $table->unsignedBigInteger('city_id')->nullable()->comment('ID de la ciudad');
            $table->foreign('city_id')->references('id')->on('ciudades');
            $table->foreignId('type_person_id_sender')->nullable()->constrained('type_people')->nullOnDelete()->comment('Tipo de persona remitente');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('filings', function (Blueprint $table) {
            // Eliminar claves foráneas
            $table->dropForeign(['country_id']);
            $table->dropForeign(['department_id']);
            $table->dropForeign(['city_id']);
            $table->dropForeign(['type_person_id_sender']);

            // Eliminar columnas
            $table->dropColumn('filing_number');
            $table->dropColumn('name_social_reason_sender');
            $table->dropColumn('first_surname_legal_representative_sender');
            $table->dropColumn('document_nit_sender');
            $table->dropColumn('address_sender');
            $table->dropColumn('email_sender');
            $table->dropColumn('phone_sender');
            $table->dropColumn('country_id');
            $table->dropColumn('department_id');
            $table->dropColumn('city_id');
            $table->dropColumn('type_person_id_sender');
        });
    }
};
