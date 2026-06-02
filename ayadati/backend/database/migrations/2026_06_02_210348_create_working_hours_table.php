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
        Schema::create('working_hours', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_id')->constrained()->cascadeOnDelete();
            // يوم الأسبوع وفق Carbon: 0=الأحد .. 6=السبت.
            $table->unsignedTinyInteger('day_of_week');
            $table->time('start_time');
            $table->time('end_time');
            // مدة الكشف بالدقائق (تُولَّد منها الفترات/slots).
            $table->unsignedSmallInteger('slot_duration')->default(30);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // فهرس لجلب أوقات عمل الطبيب ليوم معيّن بسرعة.
            $table->index(['doctor_id', 'day_of_week']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('working_hours');
    }
};
