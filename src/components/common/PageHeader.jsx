import { Link, useLocation } from 'react-router-dom';
import { HiOutlineChevronRight, HiOutlineHome } from 'react-icons/hi';

// =============================================
// Page Header Component
// =============================================
export function PageHeader({ title, subtitle, actions, breadcrumbs = [] }) {
  const location = useLocation();

  // Auto-generate breadcrumbs from path if not provided
  const crumbs = breadcrumbs.length > 0 ? breadcrumbs : (() => {
    const parts = location.pathname.split('/').filter(Boolean);
    return [
      { label: 'Dashboard', path: '/dashboard' },
      ...parts.map((part, i) => ({
        label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
        path: '/' + parts.slice(0, i + 1).join('/'),
      })),
    ];
  })();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm text-erp-muted dark:text-erp-dark-text mb-1.5">
          <Link to="/dashboard" className="hover:text-primary transition-colors">
            <HiOutlineHome className="w-3.5 h-3.5" />
          </Link>
          {crumbs.slice(1).map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <HiOutlineChevronRight className="w-3.5 h-3.5" />
              {i === crumbs.length - 2 ? (
                <span className="text-erp-heading dark:text-erp-dark-heading font-medium">{crumb.label}</span>
              ) : (
                <Link to={crumb.path} className="hover:text-primary transition-colors">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
        <h1 className="text-h3 font-heading font-bold text-erp-heading dark:text-erp-dark-heading leading-tight">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-erp-text dark:text-erp-dark-text mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}

// =============================================
// Search Box Component
// =============================================
export function SearchBox({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-erp-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-input pl-9"
      />
    </div>
  );
}

// =============================================
// Stat Card Component
// =============================================
export function StatCard({ title, value, change, changeType = 'positive', icon: Icon, color = 'primary', prefix = '', suffix = '' }) {
  const colorMap = {
    primary: { bg: 'bg-primary-50 dark:bg-primary-900/20', icon: 'text-primary', border: 'border-primary-100' },
    secondary: { bg: 'bg-secondary-100 dark:bg-secondary-900/20', icon: 'text-secondary', border: 'border-secondary-100' },
    success: { bg: 'bg-success-100 dark:bg-green-900/20', icon: 'text-success', border: 'border-green-100' },
    warning: { bg: 'bg-warning-100 dark:bg-orange-900/20', icon: 'text-warning', border: 'border-orange-100' },
    danger: { bg: 'bg-danger-100 dark:bg-red-900/20', icon: 'text-danger', border: 'border-red-100' },
    accent: { bg: 'bg-accent-100 dark:bg-amber-900/20', icon: 'text-accent', border: 'border-amber-100' },
  };
  const c = colorMap[color] || colorMap.primary;

  return (
    <div className="card-hover p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-erp-muted dark:text-erp-dark-text truncate">{title}</p>
          <p className="text-2xl font-bold font-heading text-erp-heading dark:text-erp-dark-heading mt-2 mb-1">
            {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}{suffix}
          </p>
          {change !== undefined && (
            <p className={`text-xs font-medium flex items-center gap-0.5 ${
              changeType === 'positive' ? 'text-success' : changeType === 'negative' ? 'text-danger' : 'text-erp-muted'
            }`}>
              {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : '→'}
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 ${c.bg} rounded-2xl flex items-center justify-center flex-shrink-0 ml-4`}>
            <Icon className={`w-6 h-6 ${c.icon}`} />
          </div>
        )}
      </div>
    </div>
  );
}
