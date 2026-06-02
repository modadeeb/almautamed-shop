/* eslint-disable react-refresh/only-export-components -- ملف توجيه: يصدّر router لا مكوّناً */
import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/Layout'

// تحميل كسول (lazy) لكل صفحة → تقسيم الكود (code splitting) لكل مسار.
const Home = lazy(() => import('@/pages/Home'))
const NotFound = lazy(() => import('@/pages/NotFound'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
