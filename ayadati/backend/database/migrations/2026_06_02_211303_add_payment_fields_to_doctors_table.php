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
        Schema::table('doctors', function (Blueprint $table) {
            // رسوم الكشف بالريال اليمني (تُدار في M6).
            $table->decimal('consultation_fee', 10, 2)->default(0)->after('years_experience');
            // بيانات حساب بنك الكريمي للإيداع.
            $table->string('karimi_account_number')->nullable()->after('consultation_fee');
            $table->string('karimi_account_name')->nullable()->after('karimi_account_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->dropColumn(['consultation_fee', 'karimi_account_number', 'karimi_account_name']);
        });
    }
};
