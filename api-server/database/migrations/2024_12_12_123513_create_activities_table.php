<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->date('date');
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->integer('position')->default(0);
            $table->string('name');
            $table->text('description')->nullable();
            $table->text('notes')->nullable();
            $table->json('metrics')->nullable();
            $table->timestamps();

            $table->foreign('parent_id')
                ->references('id')
                ->on('activities')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
