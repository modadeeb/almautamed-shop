<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * ضغط استجابات النص (JSON بشكل أساسي) بـ gzip عندما يدعمه العميل، لتقليل
 * استهلاك البيانات على شبكات 3G الضعيفة.
 *
 * في الإنتاج يُفضَّل ترك الضغط (gzip/brotli) لخادم الويب (nginx) عند توفّره؛
 * هذا الـ middleware احتياط على مستوى التطبيق ولا يضغط ما هو مضغوط أصلاً
 * أو الاستجابات المتدفّقة/الملفات.
 */
class CompressResponse
{
    /** الحد الأدنى لحجم المحتوى (بايت) قبل تطبيق الضغط. */
    private const MIN_LENGTH = 1024;

    public function handle(Request $request, Closure $next): Response
    {
        /** @var Response $response */
        $response = $next($request);

        if (! $this->shouldCompress($request, $response)) {
            return $response;
        }

        $content = $response->getContent();
        if ($content === false || strlen($content) < self::MIN_LENGTH) {
            return $response;
        }

        $compressed = gzencode($content, 6);
        if ($compressed === false) {
            return $response;
        }

        $response->setContent($compressed);
        $response->headers->set('Content-Encoding', 'gzip');
        $response->headers->set('Content-Length', (string) strlen($compressed));
        $response->headers->set('Vary', 'Accept-Encoding');

        return $response;
    }

    private function shouldCompress(Request $request, Response $response): bool
    {
        if ($response instanceof StreamedResponse || $response instanceof BinaryFileResponse) {
            return false;
        }

        if ($response->headers->has('Content-Encoding')) {
            return false;
        }

        if (! str_contains($request->headers->get('Accept-Encoding', ''), 'gzip')) {
            return false;
        }

        if (! function_exists('gzencode')) {
            return false;
        }

        $contentType = (string) $response->headers->get('Content-Type', '');

        return str_contains($contentType, 'application/json')
            || str_contains($contentType, 'text/');
    }
}
