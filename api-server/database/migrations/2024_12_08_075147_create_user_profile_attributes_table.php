<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('user_profile_attributes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_profile_id')->constrained('user_profiles')->onDelete('cascade');
            $table->string('attribute_key');
            $table->text('attribute_value')->nullable();
            $table->timestamps();

            $table->index(['user_profile_id', 'attribute_key']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_profile_attributes');
    }
};
