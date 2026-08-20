import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { HiOutlineHome } from 'react-icons/hi';
import { APP_NAME } from '../constants';

export function NotFoundPage() {
  return (
    <>
      <Helmet><title>404 Not Found — {APP_NAME}</title></Helmet>
      <div className="min-h-screen bg-erp-bg dark:bg-erp-dark-bg flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="text-8xl font-bold font-heading text-gradient-primary mb-4">404</div>
          <h1 className="text-h2 font-heading font-bold text-erp-heading dark:text-erp-dark-heading mb-3">
            Page Not Found
          </h1>
          <p className="text-erp-text dark:text-erp-dark-text mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link to="/dashboard" className="btn-primary btn btn-lg inline-flex">
            <HiOutlineHome className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </motion.div>
      </div>
    </>
  );
}

export function AccessDeniedPage() {
  return (
    <>
      <Helmet><title>Access Denied — {APP_NAME}</title></Helmet>
      <div className="min-h-screen bg-erp-bg dark:bg-erp-dark-bg flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="text-8xl mb-4">🚫</div>
          <h1 className="text-h2 font-heading font-bold text-erp-heading dark:text-erp-dark-heading mb-3">
            Access Denied
          </h1>
          <p className="text-erp-text dark:text-erp-dark-text mb-8">
            You don't have permission to view this page. Please contact your administrator.
          </p>
          <Link to="/dashboard" className="btn-primary btn btn-lg inline-flex">
            <HiOutlineHome className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </motion.div>
      </div>
    </>
  );
}
