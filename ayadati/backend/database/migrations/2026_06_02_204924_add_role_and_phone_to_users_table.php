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
        Schema::table('users', function (Blueprint $table) {
            // الدور: admin / doctor / patient. مفهرس للاستعلامات حسب الدور.
            $table->string('role', 20)->default('patient')->after('email')->index();
            // رقم الهاتف (لتذكيرات واتساب/SMS) — فريد ويسمح بقيم فارغة.
            $table->string('phone', 20)->nullable()->unique()->after('role');
            // تعطيل الحساب (مثلاً طبيب موقوف) دون حذفه.
            $table->boolean('is_active')->default(true)->after('phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['phone']);
            $table->dropIndex(['role']);
            $table->dropColumn(['role', 'phone', 'is_active']);
        });
    }
};
