/* eslint-disable react-refresh/only-export-components -- ملف توجيه: يصدّر router لا مكوّناً */
import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { ProtectedRoute } from '@/components/ProtectedRoute'

// تحميل كسول (lazy) لكل صفحة → تقسيم الكود (code splitting) لكل مسار.
const Home = lazy(() => import('@/pages/Home'))
const Login = lazy(() => import('@/pages/auth/Login'))
const Register = lazy(() => import('@/pages/auth/Register'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const DoctorSearch = lazy(() => import('@/pages/doctors/DoctorSearch'))
const DoctorProfile = lazy(() => import('@/pages/doctors/DoctorProfile'))
const BookingCheckout = lazy(() => import('@/pages/booking/BookingCheckout'))
const MyAppointments = lazy(() => import('@/pages/patient/MyAppointments'))
const DoctorWorkingHours = lazy(() => import('@/pages/doctor/WorkingHours'))
const NotFound = lazy(() => import('@/pages/NotFound'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'doctors', element: <DoctorSearch /> },
      { path: 'doctors/:id', element: <DoctorProfile /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'doctors/:id/book',
        element: (
          <ProtectedRoute roles={['patient']}>
            <BookingCheckout />
          </ProtectedRoute>
        ),
      },
      {
        path: 'my/appointments',
        element: (
          <ProtectedRoute roles={['patient']}>
            <MyAppointments />
          </ProtectedRoute>
        ),
      },
      {
        path: 'doctor/schedule',
        element: (
          <ProtectedRoute roles={['doctor']}>
            <DoctorWorkingHours />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])
