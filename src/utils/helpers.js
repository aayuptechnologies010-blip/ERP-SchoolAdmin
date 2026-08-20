import dayjs from 'dayjs';
import { DATE_FORMAT, DATE_TIME_FORMAT, TIME_FORMAT } from '../constants';

// Date formatting
export const formatDate = (date) => (date ? dayjs(date).format(DATE_FORMAT) : '—');
export const formatDateTime = (date) => (date ? dayjs(date).format(DATE_TIME_FORMAT) : '—');
export const formatTime = (date) => (date ? dayjs(date).format(TIME_FORMAT) : '—');
export const fromNow = (date) => (date ? dayjs(date).fromNow() : '—');

// Number formatting
export const formatCurrency = (amount, currency = '₹') =>
  `${currency}${Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const formatNumber = (n) => Number(n || 0).toLocaleString('en-IN');

export const formatPercent = (n, decimals = 1) => `${Number(n || 0).toFixed(decimals)}%`;

// String helpers
export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

export const truncate = (str, max = 30) =>
  str && str.length > max ? `${str.slice(0, max)}…` : str || '';

export const initials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

// Status badge color mapper
export const statusColor = (status) => {
  const map = {
    active: 'success',
    inactive: 'gray',
    pending: 'warning',
    paid: 'success',
    unpaid: 'danger',
    partial: 'warning',
    present: 'success',
    absent: 'danger',
    late: 'warning',
    leave: 'secondary',
  };
  return map[status] || 'gray';
};

// Avatar fallback color from name
export const avatarColor = (name = '') => {
  const colors = [
    'bg-primary-100 text-primary-700',
    'bg-secondary-100 text-secondary-700',
    'bg-accent-100 text-accent-700',
    'bg-purple-100 text-purple-700',
    'bg-pink-100 text-pink-700',
    'bg-indigo-100 text-indigo-700',
  ];
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) % colors.length;
  return colors[hash];
};

// Generate roll number
export const generateRollNo = (classStr, section, index) =>
  `${classStr.replace('-', '').toUpperCase()}${section}${String(index).padStart(3, '0')}`;
