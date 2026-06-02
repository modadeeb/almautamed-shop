import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Skeleton } from '@/components/Skeleton'

/**
 * يعرض صورة الإيصال المحميّة. نجلبها كـ blob (مع رمز المصادقة) ثم نعرضها
 * عبر object URL، لأن <img src> لا يُرسل ترويسة Authorization.
 */
export function ReceiptImage({ appointmentId }: { appointmentId: number }) {
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let revoked: string | null = null
    let active = true

    api
      .get(`/api/appointments/${appointmentId}/receipt`, { responseType: 'blob' })
      .then((res) => {
        if (!active) return
        const objectUrl = URL.createObjectURL(res.data as Blob)
        revoked = objectUrl
        setUrl(objectUrl)
      })
      .catch(() => active && setError(true))

    return () => {
      active = false
      if (revoked) URL.revokeObjectURL(revoked)
    }
  }, [appointmentId])

  if (error) return <p className="text-sm text-danger">تعذّر تحميل الإيصال.</p>
  if (!url) return <Skeleton className="h-48 w-full" />

  return (
    <img
      src={url}
      alt="إيصال الدفع"
      className="max-h-72 rounded border border-line object-contain"
    />
  )
}
