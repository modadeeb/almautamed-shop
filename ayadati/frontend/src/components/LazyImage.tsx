import { useState } from 'react'

interface Props {
  src: string | null
  alt: string
  className?: string
  fallbackText?: string
}

/**
 * صورة بتحميل كسول (lazy) وأبعاد محجوزة لتقليل القفز، مع بديل عند غياب الصورة
 * أو فشل تحميلها — مهمّ لشبكات 3G الضعيفة.
 */
export function LazyImage({ src, alt, className = '', fallbackText = '👤' }: Props) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-primary-light text-2xl text-primary ${className}`}
        aria-label={alt}
        role="img"
      >
        {fallbackText}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  )
}
