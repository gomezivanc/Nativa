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
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->string("title", 60)->nullable();
            $table->bigInteger("parent_id")->default(0)->nullable();
            $table->integer("type")->default(1)->nullable();
            $table->string("uri", 200)->nullable();
            $table->string("target")->default("_self")->nullable();
            $table->string("icon", 40)->nullable();
            $table->string("method")->nullable();
            $table->integer("status")->default(1)->nullable();
            $table->bigInteger('created_by')->default('0')->nullable();
            $table->bigInteger('updated_by')->default('0')->nullable();
            $table->bigInteger('deleted_by')->default('0')->nullable();
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
        Schema::dropIfExists('menus');
    }
};
