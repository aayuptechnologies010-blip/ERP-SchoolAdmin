import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from './guards';
import { PageLoader } from '../components/ui';
import MainLayout from '../layouts/MainLayout';
import { NotFoundPage, AccessDeniedPage } from '../pages/ErrorPages';

// Lazy-loaded pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));

// Students
const StudentListPage = lazy(() => import('../pages/students/StudentListPage'));
const StudentFormPage = lazy(() => import('../pages/students/StudentFormPage'));
const PromotionPage = lazy(() => import('../pages/students/PromotionPage'));

// Teachers
const TeacherListPage = lazy(() => import('../pages/teachers/TeacherListPage'));
const TeacherFormPage = lazy(() => import('../pages/teachers/TeacherFormPage'));

// Staff
const StaffListPage = lazy(() => import('../pages/staff/StaffListPage'));
const StaffFormPage = lazy(() => import('../pages/staff/StaffFormPage'));

// Attendance
const AttendancePage = lazy(() => import('../pages/attendance/AttendancePage'));

// Fees
const FeesPage = lazy(() => import('../pages/fees/FeesPage'));
const FeeCollectPage = lazy(() => import('../pages/fees/FeeCollectPage'));

// Exams
const ExamsPage = lazy(() => import('../pages/exams/ExamsPage'));
const ExamFormPage = lazy(() => import('../pages/exams/ExamFormPage'));

// Other modules
const TimetablePage = lazy(() => import('../pages/timetable/TimetablePage'));
const LibraryPage = lazy(() => import('../pages/library/LibraryPage'));

// Profile
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));

// Reports & Settings
const ReportsPage = lazy(() => import('../pages/reports/ReportsPage'));
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'));

function Lazy({ Component, ...props }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component {...props} />
    </Suspense>
  );
}

const router = createBrowserRouter([
  // ── Public ──────────────────────────────────────────
  {
    element: <PublicRoute />,
    children: [
      { path: '/login', element: <Lazy Component={LoginPage} /> },
      { path: '/forgot-password', element: <Lazy Component={ForgotPasswordPage} /> },
      { path: '/reset-password/:token', element: <Lazy Component={ResetPasswordPage} /> },
    ],
  },

  // ── Protected ────────────────────────────────────────
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: <Lazy Component={DashboardPage} /> },

          // Students
          { path: '/students', element: <Lazy Component={StudentListPage} /> },
          { path: '/students/add', element: <Lazy Component={StudentFormPage} /> },
          { path: '/students/promotion', element: <Lazy Component={PromotionPage} /> },
          { path: '/students/:id', element: <Lazy Component={StudentFormPage} isEdit /> },
          { path: '/students/:id/edit', element: <Lazy Component={StudentFormPage} isEdit /> },

          // Teachers
          { path: '/teachers', element: <Lazy Component={TeacherListPage} /> },
          { path: '/teachers/add', element: <Lazy Component={TeacherFormPage} /> },
          { path: '/teachers/:id', element: <Lazy Component={TeacherFormPage} isEdit /> },
          { path: '/teachers/:id/edit', element: <Lazy Component={TeacherFormPage} isEdit /> },

          // Staff
          { path: '/staff', element: <Lazy Component={StaffListPage} /> },
          { path: '/staff/add', element: <Lazy Component={StaffFormPage} /> },
          { path: '/staff/:id', element: <Lazy Component={StaffFormPage} isEdit /> },
          { path: '/staff/:id/edit', element: <Lazy Component={StaffFormPage} isEdit /> },

          // Attendance
          { path: '/attendance', element: <Lazy Component={AttendancePage} /> },
          { path: '/attendance/mark', element: <Lazy Component={AttendancePage} /> },

          // Fees
          { path: '/fees', element: <Lazy Component={FeesPage} /> },
          { path: '/fees/collect', element: <Lazy Component={FeeCollectPage} /> },
          { path: '/fees/structure', element: <Lazy Component={FeesPage} /> },

          // Exams
          { path: '/exams', element: <Lazy Component={ExamsPage} /> },
          { path: '/exams/add', element: <Lazy Component={ExamFormPage} /> },
          { path: '/exams/:id/edit', element: <Lazy Component={ExamFormPage} isEdit /> },
          { path: '/exams/results', element: <Lazy Component={ExamsPage} /> },

          // Timetable & Library
          { path: '/timetable', element: <Lazy Component={TimetablePage} /> },
          { path: '/library', element: <Lazy Component={LibraryPage} /> },

          // Profile
          { path: '/profile', element: <Lazy Component={ProfilePage} /> },

          // Reports & Settings
          { path: '/reports', element: <Lazy Component={ReportsPage} /> },
          { path: '/settings', element: <Lazy Component={SettingsPage} /> },

          // Errors
          { path: '/access-denied', element: <AccessDeniedPage /> },
        ],
      },
    ],
  },

  // ── 404 ──────────────────────────────────────────────
  { path: '*', element: <NotFoundPage /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
