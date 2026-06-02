<?php

use App\Http\Middleware\CompressResponse;
use App\Http\Middleware\SecurityHeaders;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // ترويسات الأمان وضغط الاستجابات على كل الطلبات.
        $middleware->append(SecurityHeaders::class);
        $middleware->append(CompressResponse::class);

        // مصادقة Sanctum القائمة على الكوكيز لطلبات الواجهة (SPA).
        $middleware->statefulApi();

        // اسم مختصر لـ middleware التحقّق من الدور.
        $middleware->alias([
            'role' => \App\Http\Middleware\EnsureRole::class,
        ]);

        // تحديد معدّل الطلبات الافتراضي لمسارات الـ API (يُشدَّد لكل مسار حسّاس في M1+).
        $middleware->api(prepend: [
            \Illuminate\Routing\Middleware\ThrottleRequests::class.':api',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // كل أخطاء مسارات api/* تُعاد كـ JSON.
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

        // توحيد شكل أخطاء الـ API برسائل عربية واضحة.
        $exceptions->render(function (ValidationException $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return response()->json([
                'message' => 'البيانات المُدخلة غير صحيحة.',
                'errors' => $e->errors(),
            ], 422);
        });

        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return response()->json([
                'message' => 'يجب تسجيل الدخول للوصول إلى هذا المورد.',
            ], 401);
        });

        $exceptions->render(function (HttpExceptionInterface $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            $messages = [
                403 => 'ليس لديك صلاحية للقيام بهذا الإجراء.',
                404 => 'المورد المطلوب غير موجود.',
                405 => 'الإجراء غير مسموح به.',
                429 => 'عدد كبير من المحاولات، يُرجى المحاولة لاحقاً.',
            ];

            $status = $e->getStatusCode();
            $message = $messages[$status] ?? ($e->getMessage() ?: 'حدث خطأ في معالجة الطلب.');

            return response()->json(['message' => $message], $status);
        });
    })->create();
