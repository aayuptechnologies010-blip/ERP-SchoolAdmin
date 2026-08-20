// =============================================
// Application Constants
// =============================================

export const APP_NAME = 'EduERP';
export const APP_FULL_NAME = 'EduERP School Management System';
export const APP_VERSION = '1.0.0';
export const APP_TAGLINE = 'Empowering Education Through Technology';

// API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const TOKEN_KEY = 'erp_auth_token';
export const USER_KEY = 'erp_auth_user';
export const THEME_KEY = 'erp_theme';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

// Date Formats
export const DATE_FORMAT = 'DD MMM YYYY';
export const DATE_TIME_FORMAT = 'DD MMM YYYY, hh:mm A';
export const TIME_FORMAT = 'hh:mm A';

// Table
export const SORT_ORDERS = { ASC: 'asc', DESC: 'desc' };

// Status
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  PAID: 'paid',
  UNPAID: 'unpaid',
  PARTIAL: 'partial',
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  LEAVE: 'leave',
};

export const STATUS_LABELS = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
  paid: 'Paid',
  unpaid: 'Unpaid',
  partial: 'Partial',
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  leave: 'On Leave',
};

// Gender
export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

// Class options
export const CLASS_OPTIONS = [
  'Nursery', 'KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4',
  'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11', 'Class 12',
].map((c) => ({ value: c.toLowerCase().replace(' ', '-'), label: c }));

// Section options
export const SECTION_OPTIONS = ['A', 'B', 'C', 'D'].map((s) => ({ value: s, label: `Section ${s}` }));

// Subjects
export const SUBJECT_OPTIONS = [
  'Mathematics', 'Science', 'English', 'Hindi', 'Social Studies',
  'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Physical Education',
  'Art & Craft', 'Music',
].map((s) => ({ value: s.toLowerCase().replace(/ /g, '-'), label: s }));

// Fee Types
export const FEE_TYPES = [
  { value: 'tuition', label: 'Tuition Fee' },
  { value: 'transport', label: 'Transport Fee' },
  { value: 'library', label: 'Library Fee' },
  { value: 'sports', label: 'Sports Fee' },
  { value: 'lab', label: 'Lab Fee' },
  { value: 'exam', label: 'Exam Fee' },
  { value: 'admission', label: 'Admission Fee' },
  { value: 'miscellaneous', label: 'Miscellaneous' },
];

// Months
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
].map((m, i) => ({ value: i + 1, label: m }));
