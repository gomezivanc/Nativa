ear
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
        Schema::table('exp_files', function (Blueprint $table) {
            // disposicion final eliminar
            $table->string('type_delete')->nullable()->comment('Manera en la que ocurrio la dispocicion final del expediente');
            $table->bigInteger('deleted_dispo_id')->nullable()->comment('Id de la persona que aplico la dispocicion final de eliminación');
            $table->bigInteger('approved_deleted_dispo_id')->nullable()->comment('Id de la persona que aprobo la dispocicion final de eliminación');
            $table->boolean('is_dispo_final_delete')->nullable()->comment('Flag de si se elimino en dispocicion final: null ninguna accion, 0: en proceso de aprobación, 1: eliminado');
            $table->text('observation_delete')->nullable()->comment('Observacion de quien solicito la eliminación');

            // disposicion final conservar
            $table->bigInteger('conserver_user_id')->nullable()->comment('Id del usuario quien conservo');
            $table->bigInteger('approved_conserver_user_id')->nullable()->comment('Id del usuario quien aprovo la conservación');
            $table->boolean('is_dispo_final_conservation')->nullable()->comment('Flag de si se conservo en disposicion final: null ninguna accion, 0: en proceso de aprobación, 1: conservado');
            $table->text('observation_con')->nullable()->comment('Observacion de quien solicito la conservación');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('exp_files', function (Blueprint $table) {
            $table->dropColumn('type_delete');
            $table->dropColumn('deleted_dispo_id');
            $table->dropColumn('is_dispo_final_delete');
            $table->dropColumn('is_dispo_final_conservation');
            $table->dropColumn('conserver_user_id');
            $table->dropColumn('approved_deleted_dispo_id');
            $table->dropColumn('approved_conserver_user_id');
            $table->dropColumn('observation_delete');
            $table->dropColumn('observation_con');
        });
    }
};
