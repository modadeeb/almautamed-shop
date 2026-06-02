<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * تخزين إيصالات الدفع بأمان:
 * - على قرص خاص (storage/app/private) لا يُخدَم مباشرةً من الويب ولا يُنفَّذ منه كود.
 * - باسم ملف عشوائي مع امتداد مشتقّ من النوع الحقيقي للملف (لا من اسم المستخدم).
 */
class ReceiptStorageService
{
    private const DISK = 'local';

    public function store(UploadedFile $file): string
    {
        // امتداد آمن مشتقّ من النوع الفعلي (mime) لا من الاسم الأصلي.
        $extension = match ($file->getMimeType()) {
            'image/png' => 'png',
            'image/webp' => 'webp',
            default => 'jpg',
        };

        $name = Str::random(40).'.'.$extension;

        return $file->storeAs('receipts/'.now()->format('Y/m'), $name, self::DISK);
    }

    public function delete(?string $path): void
    {
        if ($path && Storage::disk(self::DISK)->exists($path)) {
            Storage::disk(self::DISK)->delete($path);
        }
    }

    public function disk(): string
    {
        return self::DISK;
    }
}
