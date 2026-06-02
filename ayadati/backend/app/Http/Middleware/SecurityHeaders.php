<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * يضيف ترويسات أمان HTTP وفق توصيات OWASP إلى كل استجابة.
 *
 * ملاحظة: فرض HTTPS (HSTS) وإعادة التوجيه إليه يتمّان على مستوى الخادم/الموازن
 * في الإنتاج؛ هنا نضيف الترويسة فقط عندما يكون الطلب آمناً (HTTPS).
 */
class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        /** @var Response $response */
        $response = $next($request);

        $headers = [
            'X-Content-Type-Options' => 'nosniff',
            'X-Frame-Options' => 'DENY',
            'Referrer-Policy' => 'strict-origin-when-cross-origin',
            'X-Permitted-Cross-Domain-Policies' => 'none',
            'Cross-Origin-Opener-Policy' => 'same-origin',
            'Permissions-Policy' => 'geolocation=(), microphone=(), camera=()',
        ];

        // HSTS يُفعَّل فقط فوق HTTPS لتجنّب حجب التطوير المحلي.
        if ($request->secure()) {
            $headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
        }

        foreach ($headers as $key => $value) {
            if (! $response->headers->has($key)) {
                $response->headers->set($key, $value);
            }
        }

        return $response;
    }
}
