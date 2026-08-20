import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useSidebar } from '../hooks/useSidebar';

export default function MainLayout() {
  const { collapsed, mobileOpen, toggleCollapsed, toggleMobile, closeMobile } = useSidebar();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-erp-bg dark:bg-erp-dark-bg">
      <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} closeMobile={closeMobile} />
      <Navbar
        collapsed={collapsed}
        onToggleSidebar={toggleCollapsed}
        onToggleMobile={toggleMobile}
      />

      {/* Main content area shifts right by sidebar width */}
      <main
        className="min-h-screen pt-16 transition-all duration-300 ease-in-out"
        style={{ marginLeft: collapsed ? 72 : 272 }}
      >
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="page-container"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}

// =============================================
// Auth Layout
// =============================================
export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
