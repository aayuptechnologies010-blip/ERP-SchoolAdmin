import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineArrowLeft, HiOutlineAcademicCap } from 'react-icons/hi';
import { Helmet } from 'react-helmet-async';
import api from '../../api/api';
import { notify } from '../../utils/notify';
import { APP_NAME, APP_TAGLINE } from '../../constants';

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
});

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [devToken, setDevToken] = useState(''); // shown only because there's no email service wired up yet

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const { data: res } = await api.post('/auth/forgot-password', data);
      setSent(true);
      // TODO: once real email sending (nodemailer/SendGrid) is wired up on the
      // backend, remove this - the reset link should only ever reach the
      // user's inbox, never the screen.
      if (res.resetToken) setDevToken(res.resetToken);
      notify.success('If that email exists, a reset link has been generated.');
    } catch (err) {
      notify.error(err.message);
    }
  };

  return (
    <>
      <Helmet><title>Forgot Password — {APP_NAME}</title></Helmet>
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
            <h2 className="text-lg font-bold text-erp-heading dark:text-white mb-1.5">Reset your password</h2>
            <p className="text-sm text-erp-muted dark:text-erp-dark-text mb-6">
              Enter your account email and we'll generate a password reset link.
            </p>

            {sent ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3">
                  Reset link generated. Check your email inbox (or ask your admin) for next steps.
                </div>
                {devToken && (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs px-4 py-3 break-all">
                    <p className="font-semibold mb-1">Dev mode — no email service configured yet:</p>
                    <Link to={`/reset-password/${devToken}`} className="underline font-mono">
                      /reset-password/{devToken}
                    </Link>
                  </div>
                )}
                <Link to="/login" className="btn-outline btn w-full inline-flex items-center justify-center gap-2">
                  <HiOutlineArrowLeft className="w-4 h-4" /> Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <div className="space-y-1.5">
                  <label className="form-label">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <HiOutlineMail className="w-4 h-4 text-erp-muted" />
                    </span>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className={`form-input pl-10 ${errors.email ? 'border-danger focus:border-danger focus:ring-red-100' : ''}`}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && <p className="form-error">{errors.email.message}</p>}
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-primary btn w-full">
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </button>

                <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-erp-muted hover:text-primary">
                  <HiOutlineArrowLeft className="w-4 h-4" /> Back to Login
                </Link>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
