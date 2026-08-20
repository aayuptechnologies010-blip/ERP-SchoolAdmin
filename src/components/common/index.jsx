import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineSearch,
  HiOutlineSortAscending,
  HiOutlineSortDescending,
  HiOutlineX,
} from 'react-icons/hi';
import { LuDownload, LuPrinter } from 'react-icons/lu';
import { PAGE_SIZE_OPTIONS } from '../../constants';

// =============================================
// Data Table Component
// =============================================
export function DataTable({
  columns = [],
  data = [],
  total = 0,
  page = 1,
  pageSize = 10,
  totalPages = 1,
  onPageChange,
  onPageSizeChange,
  sortKey,
  sortOrder,
  onSort,
  search,
  onSearch,
  loading = false,
  emptyMessage = 'No records found',
  actions,
  showExport = true,
  showPrint = true,
  title,
}) {
  return (
    <div className="card overflow-hidden p-0">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-erp-border dark:border-erp-dark-border">
        {title && <h3 className="font-heading font-semibold text-erp-heading dark:text-erp-dark-heading">{title}</h3>}
        <div className="flex-1" />
        {onSearch && (
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-erp-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search..."
              className="form-input pl-9 py-2 w-full sm:w-64"
            />
            {search && (
              <button
                onClick={() => onSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-erp-muted hover:text-erp-heading"
              >
                <HiOutlineX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
        {actions}
        {showExport && (
          <button type="button" onClick={() => {
            const esc = (v) => `"${String(v ?? '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;
            const rows = [columns.map(c => esc(c.label)).join(','), ...data.map(row => columns.map(c => esc(row[c.key])).join(','))].join('\n');
            const url = URL.createObjectURL(new Blob([rows], { type: 'text/csv;charset=utf-8' }));
            const a = document.createElement('a'); a.href = url; a.download = `${title || 'export'}-${new Date().toISOString().slice(0,10)}.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
          }} className="btn-outline btn btn-sm gap-1.5">
            <LuDownload className="w-3.5 h-3.5" />
            Export
          </button>
        )}
        {showPrint && (
          <button
            onClick={() => window.print()}
            className="btn-outline btn btn-sm gap-1.5"
          >
            <LuPrinter className="w-3.5 h-3.5" />
            Print
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="erp-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={col.sortable ? 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors' : ''}
                  onClick={() => col.sortable && onSort?.(col.key)}
                  style={{ width: col.width }}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && (
                      <span className="text-erp-muted">
                        {sortKey === col.key ? (
                          sortOrder === 'asc' ? (
                            <HiOutlineSortAscending className="w-3.5 h-3.5 text-primary" />
                          ) : (
                            <HiOutlineSortDescending className="w-3.5 h-3.5 text-primary" />
                          )
                        ) : (
                          <HiOutlineSortAscending className="w-3.5 h-3.5 opacity-30" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-erp-muted">
                      <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-erp-muted text-sm">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <motion.tr
                    key={row.id ?? idx}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: idx * 0.02 }}
                  >
                    {columns.map((col) => (
                      <td key={col.key}>
                        {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-erp-border dark:border-erp-dark-border">
          <div className="flex items-center gap-2 text-sm text-erp-text dark:text-erp-dark-text">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              className="form-input py-1 w-16 text-xs"
            >
              {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <span className="ml-2">
              {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <HiOutlineChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2 + i, totalPages - 4 + i));
              return (
                <button
                  key={p}
                  onClick={() => onPageChange?.(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-erp-text dark:text-erp-dark-text'
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <HiOutlineChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================
// Pagination Component (standalone)
// =============================================
export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors"
      >
        <HiOutlineChevronLeft className="w-4 h-4" />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
            p === page ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors"
      >
        <HiOutlineChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// =============================================
// Modal Component
// =============================================
export function Modal({ open, onClose, title, children, size = 'md', footer }) {
  const sizeMap = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl',
  };

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`relative w-full ${sizeMap[size]} bg-white dark:bg-erp-dark-card rounded-dialog shadow-modal max-h-[90vh] flex flex-col`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-erp-border dark:border-erp-dark-border">
              <h2 className="text-h4 font-heading font-semibold text-erp-heading dark:text-erp-dark-heading">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <HiOutlineX className="w-4 h-4 text-erp-text" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">{children}</div>

            {/* Modal Footer */}
            {footer && (
              <div className="p-6 border-t border-erp-border dark:border-erp-dark-border flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// =============================================
// Tabs Component
// =============================================
export function Tabs({ tabs = [], active, onChange, className = '' }) {
  return (
    <div className={`flex gap-1 border-b border-erp-border dark:border-erp-dark-border ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`relative px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none ${
            active === tab.key
              ? 'text-primary dark:text-primary-400'
              : 'text-erp-text dark:text-erp-dark-text hover:text-erp-heading dark:hover:text-erp-dark-heading'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-1.5 badge-gray badge text-xs">{tab.count}</span>
          )}
          {active === tab.key && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
            />
          )}
        </button>
      ))}
    </div>
  );
}

// =============================================
// Dropdown Component
// =============================================
export function Dropdown({ trigger, items = [], align = 'left' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 mt-2 w-48 bg-white dark:bg-erp-dark-card border border-erp-border dark:border-erp-dark-border rounded-card shadow-dropdown ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            <div className="py-1">
              {items.map((item, i) =>
                item.divider ? (
                  <div key={i} className="erp-divider my-1" />
                ) : (
                  <button
                    key={i}
                    onClick={() => { item.onClick?.(); setOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors text-left ${
                      item.danger
                        ? 'text-danger hover:bg-red-50 dark:hover:bg-red-900/20'
                        : 'text-erp-text dark:text-erp-dark-text hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    {item.label}
                  </button>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
