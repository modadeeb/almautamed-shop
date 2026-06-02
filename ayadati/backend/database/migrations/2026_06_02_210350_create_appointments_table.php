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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_id')->constrained()->cascadeOnDelete();
            // المريض (قد يكون فارغاً للحجز اليدوي لمريض زائر — يُستخدم في M5).
            $table->foreignId('patient_id')->nullable()->constrained('users')->nullOnDelete();
            // اسم وهاتف بديلان للحجز اليدوي دون حساب.
            $table->string('patient_name')->nullable();
            $table->string('patient_phone', 20)->nullable();
            $table->dateTime('starts_at');
            $table->dateTime('ends_at');
            $table->string('status', 20)->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();

            // منع الحجز المزدوج على مستوى قاعدة البيانات: لا موعدان لنفس الطبيب
            // في نفس وقت البدء.
            $table->unique(['doctor_id', 'starts_at']);
            // فهارس للاستعلامات الشائعة (مواعيد الطبيب/المريض حسب الوقت).
            $table->index(['doctor_id', 'starts_at', 'status']);
            $table->index(['patient_id', 'starts_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
