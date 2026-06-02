import { Link } from 'react-router-dom'

/** صفحة 404 بالعربية. */
export default function NotFound() {
  return (
    <div className="card mx-auto max-w-md text-center">
      <div className="text-5xl">🔍</div>
      <h1 className="mt-3 text-xl text-primary-dark">الصفحة غير موجودة</h1>
      <p className="mt-2 text-ink-muted">
        عذراً، الصفحة التي تبحث عنها غير متوفّرة.
      </p>
      <Link to="/" className="btn-primary mt-4">
        العودة للرئيسية
      </Link>
    </div>
  )
}
