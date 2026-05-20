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
        Schema::create('conf_trds', function (Blueprint $table) {
            $table->id();
            // Configuración inicial carga TRD
            $table->foreignId('conf_mask_trd_id')->comment('Relacion con la tabla de la Mascara')->constrained('conf_mask_trds');
            $table->string('dependency_code')->comment('Codigo de dependencia');
            $table->string('dependency_name')->comment('Nombre de dependencia');
            $table->string('unity_admin')->comment('Unidad administrativa');
            $table->boolean('has_regional')->default(0)->comment('Indicativo de si es regional');
            $table->string('regional')->nullable()->comment('Regional');

            // Configuración inicial carga TRD
            $table->string('init_data')->comment('Inicio de los datos');
            $table->string('code_trd')->comment('Codigo de trd o dependencia');
            $table->string('series_sub_series_t_doc')->comment('Nombre de serie Subserie, tipos documentales');
            $table->string('items_year_gestion')->comment('años archivo de gestion');
            $table->string('items_year_central')->comment('Items de año archivo central');
            // $table->string('items_dispo_final')->comment('Item disposición final');
            $table->string('items_dispo_final_ct')->comment('Item disposición final CT');
            $table->string('items_dispo_final_e')->comment('Item disposición final E');
            $table->string('items_dispo_final_s')->comment('Item disposición final S');
            $table->string('items_dispo_final_md')->comment('Item disposición final MD');
            $table->string('items_pro_subseries')->comment('Item de procedimiento subseries');

            $table->boolean('conf_days_term')->default(0)->comment('Configuración dias termino');
            $table->string('days_conf_days_term')->nullable()->comment('Configuración dias termino');

            $table->boolean('Has_standard')->default(0)->comment('Tiene norma');
            $table->string('item_standard')->nullable()->comment('Item normas');

            $table->boolean('Has_support')->default(0)->comment('Tiene soporte');
            $table->string('item_support_p')->nullable()->comment('Item soporte p');
            $table->string('item_support_e')->nullable()->comment('Item soporte E');
            $table->string('item_support_o')->nullable()->comment('Item soporte O');

            $table->bigInteger('creado_por_id');

            $table->timestamps();
            $table->softDeletes()->comment('Fecha de eliminación');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('conf_trds');
    }
};
