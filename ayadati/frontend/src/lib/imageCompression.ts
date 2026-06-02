/**
 * ضغط صورة من جهة العميل قبل الرفع (مهمّ جداً على 3G):
 * يصغّر الأبعاد إلى حد أقصى ويعيد ترميزها JPEG بجودة مخفّضة.
 * يُرجع الملف الأصلي إن تعذّر الضغط لأي سبب.
 */
export async function compressImage(
  file: File,
  maxDimension = 1280,
  quality = 0.7,
): Promise<File> {
  if (!file.type.startsWith('image/')) return file

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, width, height)

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality),
    )
    if (!blob) return file

    // لا نستخدم النسخة المضغوطة إن كانت أكبر من الأصل.
    if (blob.size >= file.size) return file

    return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', {
      type: 'image/jpeg',
    })
  } catch {
    return file
  }
}
