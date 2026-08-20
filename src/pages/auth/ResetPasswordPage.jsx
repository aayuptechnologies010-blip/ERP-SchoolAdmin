import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineAcademicCap } from 'react-icons/hi';
import { Helmet } from 'react-helmet-async';
import api from '../../api/api';
import { notify } from '../../utils/notify';
import { APP_NAME, APP_TAGLINE } from '../../constants';

const schema = yup.object({
  password: yup.string().min(6, 'At least 6 characters').required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your new password'),
});

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await api.put(`/auth/reset-password/${token}`, { password: data.password });
      notify.success('Password reset successfully! Please log in.');
      navigate('/login');
    } catch (err) {
      notify.error(err.message);
    }
  };

  return (
    <>
      <Helmet><title>Reset Password — {APP_NAME}</title></Helmet>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/8 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-secondary/8 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-white mb-4">
              <HiOutlineAcademicCap className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-erp-heading dark:text-white">{APP_NAME}</h1>
            <p className="text-sm text-erp-muted dark:text-erp-dark-text mt-1">{APP_TAGLINE}</p>
          </div>

          <div className="card p-8">
            <h2 className="text-lg font-bold text-erp-heading dark:text-white mb-1.5">Set a new password</h2>
            <p className="text-sm text-erp-muted dark:text-erp-dark-text mb-6">
              Choose a strong password you haven't used before.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              <div className="space-y-1.5">
                <label className="form-label">New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <HiOutlineLockClosed className="w-4 h-4 text-erp-muted" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    className={`form-input pl-10 pr-10 ${errors.password ? 'border-danger focus:border-danger focus:ring-red-100' : ''}`}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-erp-muted"
                  >
                    {showPassword ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="form-error">{errors.password.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="form-label">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  className={`form-input ${errors.confirmPassword ? 'border-danger focus:border-danger focus:ring-red-100' : ''}`}
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-primary btn w-full">
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </button>

              <Link to="/login" className="flex items-center justify-center text-sm text-erp-muted hover:text-primary">
                Back to Login
              </Link>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
}
