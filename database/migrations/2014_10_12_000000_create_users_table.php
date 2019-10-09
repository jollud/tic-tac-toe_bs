<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('email')->unique();
            $table->integer('ttt_single_total')->default(0);
            $table->integer('ttt_single_wins')->default(0);
            $table->integer('ttt_single_losses')->default(0);
            $table->integer('ttt_single_draws')->default(0);
            $table->integer('ttt_mult_total')->default(0);
            $table->integer('ttt_mult_wins')->default(0);
            $table->integer('ttt_mult_losses')->default(0);
            $table->integer('ttt_mult_draws')->default(0);
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
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
        Schema::dropIfExists('users');
    }
}
