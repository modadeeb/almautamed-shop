import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'
import { Skeleton } from '@/components/Skeleton'

interface HealthResponse {
  status: string
  app: string
  database: string
}

/** الصفحة الرئيسية المبدئية لـ M0 — تتحقّق من اتصال الـ API لإثبات سلامة الإعداد. */
export default function Home() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['health'],
    queryFn: async (): Promise<HealthResponse> => {
      const res = await api.get<HealthResponse>('/api/health')
      return res.data
    },
  })

  return (
    <div className="space-y-6">
      <section className="card bg-gradient-to-l from-primary-light to-surface-card">
        <h1 className="mb-2 text-2xl text-primary-dark">أهلاً بك في «عيادتي»</h1>
        <p className="text-ink-muted">
          منصّة حجز العيادات الذكية في اليمن — احجز موعدك بسهولة، وتلقَّ تذكيراً
          تلقائياً قبل موعدك، وأعد الجدولة أونلاين دون عناء.
        </p>
        <Link to="/doctors" className="btn-primary mt-4">
          ابحث عن طبيب
        </Link>
      </section>

      <section className="card">
        <h2 className="mb-3 text-lg">حالة النظام</h2>
        {isPending && <Skeleton className="h-6 w-40" />}
        {isError && (
          <p className="text-danger">
            تعذّر الاتصال بالخادم حالياً. تأكّد من تشغيل واجهة الـ API.
          </p>
        )}
        {data && (
          <ul className="space-y-1 text-sm">
            <li>
              التطبيق: <span className="font-semibold">{data.app}</span>
            </li>
            <li>
              الحالة:{' '}
              <span className="font-semibold text-secondary">{data.status}</span>
            </li>
            <li>
              قاعدة البيانات:{' '}
              <span className="font-semibold text-secondary">{data.database}</span>
            </li>
          </ul>
        )}
      </section>
    </div>
  )
}
