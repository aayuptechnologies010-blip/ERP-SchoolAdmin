// =============================================
// Sidebar Navigation Menu
// =============================================
import {
  HiOutlineViewGridAdd,
  HiOutlineUsers,
  HiOutlineAcademicCap,
  HiOutlineUserGroup,
  HiOutlineClipboardList,
  HiOutlineCurrencyRupee,
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineCog,
  HiOutlineCalendar,
  HiOutlineBookOpen,
} from 'react-icons/hi';

export const SIDEBAR_MENU = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: HiOutlineViewGridAdd,
    path: '/dashboard',
  },
  {
    id: 'students',
    label: 'Students',
    icon: HiOutlineUsers,
    path: '/students',
    children: [
      { id: 'student-list', label: 'All Students', path: '/students' },
      { id: 'student-add', label: 'Add Student', path: '/students/add' },
      { id: 'student-promotion', label: 'Promotion', path: '/students/promotion' },
    ],
  },
  {
    id: 'teachers',
    label: 'Teachers',
    icon: HiOutlineAcademicCap,
    path: '/teachers',
    children: [
      { id: 'teacher-list', label: 'All Teachers', path: '/teachers' },
      { id: 'teacher-add', label: 'Add Teacher', path: '/teachers/add' },
    ],
  },
  {
    id: 'staff',
    label: 'Staff',
    icon: HiOutlineUserGroup,
    path: '/staff',
    children: [
      { id: 'staff-list', label: 'All Staff', path: '/staff' },
      { id: 'staff-add', label: 'Add Staff', path: '/staff/add' },
    ],
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: HiOutlineClipboardList,
    path: '/attendance',
    children: [
      { id: 'attendance-mark', label: 'Mark Attendance', path: '/attendance/mark' },
      { id: 'attendance-list', label: 'Attendance Report', path: '/attendance' },
    ],
  },
  {
    id: 'fees',
    label: 'Fees',
    icon: HiOutlineCurrencyRupee,
    path: '/fees',
    children: [
      { id: 'fee-list', label: 'Fee Records', path: '/fees' },
      { id: 'fee-collect', label: 'Collect Fee', path: '/fees/collect' },
      { id: 'fee-types', label: 'Fee Structure', path: '/fees/structure' },
    ],
  },
  {
    id: 'exams',
    label: 'Exams',
    icon: HiOutlineDocumentText,
    path: '/exams',
    children: [
      { id: 'exam-schedule', label: 'Schedule', path: '/exams' },
      { id: 'exam-results', label: 'Results', path: '/exams/results' },
      { id: 'exam-add', label: 'Add Exam', path: '/exams/add' },
    ],
  },
  {
    id: 'timetable',
    label: 'Timetable',
    icon: HiOutlineCalendar,
    path: '/timetable',
  },
  {
    id: 'library',
    label: 'Library',
    icon: HiOutlineBookOpen,
    path: '/library',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: HiOutlineChartBar,
    path: '/reports',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: HiOutlineCog,
    path: '/settings',
  },
];
