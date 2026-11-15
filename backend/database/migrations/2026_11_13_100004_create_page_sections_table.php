<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained()->cascadeOnDelete();
            $table->string('section_key', 100);
            $table->string('eyebrow')->nullable();
            $table->string('heading')->nullable();
            $table->text('body')->nullable();
            $table->string('icon', 50)->nullable();
            $table->string('image_path')->nullable();
            $table->string('button_text')->nullable();
            $table->string('button_url')->nullable();
            $table->string('button2_text')->nullable();
            $table->string('button2_url')->nullable();
            $table->unsignedInteger('display_order')->default(0);
            $table->timestamps();

            $table->unique(['page_id', 'section_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_sections');
    }
};
