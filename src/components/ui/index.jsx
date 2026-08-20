import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

// =============================================
// Button Component
// =============================================
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconRight,
  className = '',
  ...props
}) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    danger: 'btn-danger',
    ghost: 'btn-ghost',
    success: 'btn bg-success text-white hover:bg-success-600 focus:ring-green-300',
    warning: 'btn bg-warning text-white hover:bg-warning-600 focus:ring-orange-300',
  };
  const sizes = { sm: 'btn-sm', md: '', lg: 'btn-lg' };

  return (
    <motion.button
      whileHover={{ scale: loading || props.disabled ? 1 : 1.015 }}
      whileTap={{ scale: loading || props.disabled ? 1 : 0.985 }}
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 flex-shrink-0" />
      ) : null}
      {children}
      {iconRight && !loading && <iconRight className="w-4 h-4 flex-shrink-0 ml-0.5" />}
    </motion.button>
  );
}

// =============================================
// Input Component
// =============================================
export const Input = forwardRef(function Input(
  { label, error, hint, icon: Icon, iconRight, className = '', required, ...props },
  ref
) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Icon className="w-4 h-4 text-erp-muted" />
          </span>
        )}
        <input
          ref={ref}
          className={`form-input ${Icon ? 'pl-10' : ''} ${iconRight ? 'pr-10' : ''} ${
            error ? 'border-danger focus:border-danger focus:ring-red-100' : ''
          } ${className}`}
          {...props}
        />
        {iconRight && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
            {iconRight}
          </span>
        )}
      </div>
      {error && (
        <p className="form-error">
          <HiOutlineExclamationCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
      {hint && !error && <p className="text-caption text-erp-muted">{hint}</p>}
    </div>
  );
});

// =============================================
// Select Component
// =============================================
export const Select = forwardRef(function Select(
  { label, error, options = [], placeholder, required, className = '', ...props },
  ref
) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={`form-input ${error ? 'border-danger' : ''} ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="form-error">
          <HiOutlineExclamationCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
});

// =============================================
// Textarea Component
// =============================================
export const Textarea = forwardRef(function Textarea(
  { label, error, required, rows = 4, className = '', ...props },
  ref
) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`form-input resize-none ${error ? 'border-danger' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="form-error">
          <HiOutlineExclamationCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
});

// =============================================
// Badge Component
// =============================================
export function Badge({ children, variant = 'gray', dot = false, className = '' }) {
  return (
    <span className={`badge-${variant} ${className}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />}
      {children}
    </span>
  );
}

// =============================================
// Avatar Component
// =============================================
export function Avatar({ src, name = '', size = 'md', className = '' }) {
  const sizes = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  };

  const initial = name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const colors = [
    'bg-primary-100 text-primary-700',
    'bg-secondary-100 text-secondary-700',
    'bg-purple-100 text-purple-700',
    'bg-pink-100 text-pink-700',
    'bg-amber-100 text-amber-700',
    'bg-indigo-100 text-indigo-700',
  ];
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) % colors.length;

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover flex-shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} ${colors[hash]} rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${className}`}
    >
      {initial || '?'}
    </div>
  );
}

// =============================================
// Loader Component
// =============================================
export function Loader({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} border-2 border-primary/20 border-t-primary rounded-full animate-spin`}
      />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-erp-bg dark:bg-erp-dark-bg">
      <div className="text-center space-y-4">
        <div className="w-14 h-14 border-3 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
        <p className="text-sm text-erp-muted dark:text-erp-dark-text font-medium">Loading...</p>
      </div>
    </div>
  );
}

// =============================================
// Empty State Component
// =============================================
export function EmptyState({ icon: Icon, title = 'No data found', description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center space-y-4"
    >
      {Icon && (
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700/50 rounded-2xl flex items-center justify-center">
          <Icon className="w-8 h-8 text-erp-muted dark:text-erp-dark-text" />
        </div>
      )}
      <div>
        <h3 className="text-h4 font-medium text-erp-heading dark:text-erp-dark-heading mb-1">{title}</h3>
        {description && <p className="text-sm text-erp-muted dark:text-erp-dark-text max-w-xs">{description}</p>}
      </div>
      {action}
    </motion.div>
  );
}

// =============================================
// Status Chip Component
// =============================================
export function StatusChip({ status }) {
  const map = {
    active: 'badge-success',
    inactive: 'badge-gray',
    pending: 'badge-warning',
    paid: 'badge-success',
    unpaid: 'badge-danger',
    partial: 'badge-warning',
    present: 'badge-success',
    absent: 'badge-danger',
    late: 'badge-warning',
    leave: 'badge-secondary',
    completed: 'badge-success',
    upcoming: 'badge-primary',
    scheduled: 'badge-secondary',
  };
  const labels = {
    active: 'Active', inactive: 'Inactive', pending: 'Pending',
    paid: 'Paid', unpaid: 'Unpaid', partial: 'Partial',
    present: 'Present', absent: 'Absent', late: 'Late', leave: 'On Leave',
    completed: 'Completed', upcoming: 'Upcoming', scheduled: 'Scheduled',
  };

  return (
    <span className={`${map[status] || 'badge-gray'} badge`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {labels[status] || status}
    </span>
  );
}

// =============================================
// Card Component
// =============================================
export function Card({ children, className = '', hover = false, padding = true }) {
  return (
    <div className={`${hover ? 'card-hover' : 'card'} ${padding ? 'p-6' : ''} ${className}`}>
      {children}
    </div>
  );
}

// =============================================
// Divider
// =============================================
export function Divider({ className = '' }) {
  return <hr className={`erp-divider ${className}`} />;
}

// =============================================
// Tooltip
// =============================================
export function Tooltip({ children, text }) {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
}
