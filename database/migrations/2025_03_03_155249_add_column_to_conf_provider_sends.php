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
        Schema::table('conf_provider_sends', function (Blueprint $table) {
            //
            $table->dropForeign(['dep_id']); 
            $table->dropForeign(['ciu_id']); 
            $table->dropColumn(['dep_id', 'ciu_id']);
            $table->foreignId('regional_id')->comment('Id de la regional')->constrained('regionals');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('conf_provider_sends', function (Blueprint $table) {
            //
            $table->dropForeign(['regional_id']); 
            $table->dropColumn(['regional_id']);
        });
    }
};
