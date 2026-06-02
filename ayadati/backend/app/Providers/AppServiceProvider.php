<?php

namespace App\Providers;

use App\Services\Messaging\MessagingManager;
use App\Services\Messaging\Providers\SmsProvider;
use App\Services\Messaging\Providers\WhatsAppProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // منسّق الرسائل القابل للتبديل (واتساب أساسي / SMS احتياطي).
        $this->app->singleton(MessagingManager::class, function ($app) {
            $config = $app['config']['messaging'];

            $providers = [
                'whatsapp' => new WhatsAppProvider($config['channels']['whatsapp'] ?? []),
                'sms' => new SmsProvider($config['channels']['sms'] ?? []),
            ];

            return new MessagingManager(
                providers: $providers,
                default: $config['default'] ?? 'whatsapp',
                fallback: $config['fallback'] ?? 'sms',
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // محدّد المعدّل الافتراضي للـ API: 60 طلباً/دقيقة لكل مستخدم أو IP.
        // تُشدَّد حدود المسارات الحسّاسة (دخول/حجز/رفع) لكل مسار في M1+.
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }
}
