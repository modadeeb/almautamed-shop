<?php

namespace App\Services\Messaging\Exceptions;

use RuntimeException;

/**
 * يُرمى عند تعذّر إرسال الرسالة عبر كل القنوات المتاحة (الأساسية والاحتياطية).
 */
class MessagingException extends RuntimeException
{
}
