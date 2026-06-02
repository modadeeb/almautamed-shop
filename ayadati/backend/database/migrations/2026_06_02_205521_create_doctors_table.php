<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            // صاحب الحساب (مستخدم بدور doctor) — علاقة واحد لواحد.
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('specialty_id')->nullable()->constrained()->nullOnDelete();
            $table->string('clinic_name')->nullable();
            $table->string('city')->nullable();
            $table->string('address')->nullable();
            $table->text('bio')->nullable();
            $table->string('photo_path')->nullable();
            $table->unsignedTinyInteger('years_experience')->nullable();
            // منشور في نتائج البحث (يصبح true بعد اكتمال الملف/الاشتراك لاحقاً).
            $table->boolean('is_published')->default(false);
            $table->timestamps();

            // فهارس للبحث والفلترة السريعة.
            $table->index(['is_published', 'specialty_id']);
            $table->index('city');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
