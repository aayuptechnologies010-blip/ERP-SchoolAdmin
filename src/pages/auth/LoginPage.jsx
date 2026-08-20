import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { HiOutlineEye, HiOutlineEyeOff, HiOutlineMail, HiOutlineLockClosed, HiOutlineAcademicCap } from 'react-icons/hi';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import { notify } from '../../utils/notify';
import { APP_NAME, APP_TAGLINE } from '../../constants';

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await login(data);
      notify.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      notify.error(err.message || 'Invalid email or password');
    }
  };

  return <>
    <Helmet><title>Login — {APP_NAME}</title></Helmet>
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="relative z-10 w-full max-w-md">
        <div className="text-center mb-7">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-btn"><HiOutlineAcademicCap className="w-9 h-9 text-white"/></div>
          <h1 className="text-h2 font-heading font-bold text-erp-heading dark:text-erp-dark-heading">{APP_NAME}</h1>
          <p className="text-sm text-erp-muted dark:text-erp-dark-text mt-1">{APP_TAGLINE}</p>
        </div>
        <div className="card p-5 sm:p-8">
          <h2 className="text-h3 font-heading font-bold text-erp-heading dark:text-erp-dark-heading">School Admin Sign In</h2>
          <p className="text-sm text-erp-text dark:text-erp-dark-text mt-1 mb-6">Use the credentials created for this school.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div><label className="form-label">Email Address <span className="text-danger">*</span></label><div className="relative"><HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-erp-muted"/><input type="email" autoComplete="username" placeholder="admin@school.edu" className={`form-input pl-10 ${errors.email?'border-danger':''}`} {...register('email')}/></div>{errors.email&&<p className="form-error">{errors.email.message}</p>}</div>
            <div><div className="flex items-center justify-between"><label className="form-label mb-0">Password <span className="text-danger">*</span></label><Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link></div><div className="relative"><HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-erp-muted"/><input type={showPassword?'text':'password'} autoComplete="current-password" placeholder="Enter your password" className={`form-input pl-10 pr-10 ${errors.password?'border-danger':''}`} {...register('password')}/><button type="button" onClick={()=>setShowPassword(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-erp-muted">{showPassword?<HiOutlineEyeOff/>:<HiOutlineEye/>}</button></div>{errors.password&&<p className="form-error">{errors.password.message}</p>}</div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3">{isSubmitting?'Signing in...':'Sign In'}</button>
          </form>
        </div>
        <p className="text-center text-caption text-erp-muted mt-5">© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
      </motion.div>
    </div>
  </>;
}
