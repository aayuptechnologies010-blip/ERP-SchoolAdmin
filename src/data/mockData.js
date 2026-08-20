// =============================================
// Mock Data — Students
// =============================================
export const STUDENTS = Array.from({ length: 48 }, (_, i) => ({
  id: i + 1,
  rollNo: `CL8A${String(i + 1).padStart(3, '0')}`,
  name: [
    'Aarav Sharma', 'Diya Patel', 'Rohan Mehta', 'Ananya Singh', 'Karan Joshi',
    'Priya Gupta', 'Arjun Kumar', 'Sneha Rao', 'Vikram Nair', 'Kavya Reddy',
    'Aditya Verma', 'Pooja Mishra', 'Rahul Tiwari', 'Riya Shah', 'Manav Agarwal',
    'Sanya Kapoor', 'Rohit Bansal', 'Isha Pandey', 'Dev Chopra', 'Nisha Malhotra',
    'Yash Saxena', 'Simran Kaur', 'Nikhil Bose', 'Tanvi Sinha', 'Gaurav Yadav',
    'Ruchi Dubey', 'Vivek Gupta', 'Anjali Shukla', 'Akash Tyagi', 'Deepika Chauhan',
    'Sachin Rajput', 'Meera Nair', 'Saurabh Ghosh', 'Kritika Soni', 'Himanshu Roy',
    'Swati Jain', 'Amit Srivastava', 'Kajal Bhatt', 'Mohit Arora', 'Neha Patil',
    'Shivam Tomar', 'Shalini Dubey', 'Ujjwal Singh', 'Prerna Yadav', 'Lakshya Vyas',
    'Poonam Ahuja', 'Dhruv Kothari', 'Aditi Rathore',
  ][i],
  class: ['Class 8', 'Class 9', 'Class 10', 'Class 7', 'Class 6'][i % 5],
  section: ['A', 'B', 'C'][i % 3],
  gender: i % 3 === 1 ? 'Female' : 'Male',
  dob: `${2010 - (i % 4)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  phone: `98${String(10000000 + i * 1234567).slice(0, 8)}`,
  email: `student${i + 1}@school.edu`,
  address: `${i + 1} School Road, New Delhi`,
  fatherName: `Mr. ${['Rakesh', 'Suresh', 'Mahesh', 'Ramesh', 'Dinesh'][i % 5]} ${['Sharma', 'Patel', 'Mehta', 'Singh', 'Kumar'][i % 5]}`,
  motherName: `Mrs. ${['Sunita', 'Anita', 'Kavita', 'Savita', 'Geeta'][i % 5]} ${['Sharma', 'Patel', 'Mehta', 'Singh', 'Kumar'][i % 5]}`,
  admissionDate: `2023-${String((i % 4) + 1).padStart(2, '0')}-15`,
  status: i % 7 === 0 ? 'inactive' : 'active',
  fees: i % 4 === 0 ? 'unpaid' : i % 4 === 2 ? 'partial' : 'paid',
  avatar: null,
}));

// =============================================
// Mock Data — Teachers
// =============================================
export const TEACHERS = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  employeeId: `TCH${String(i + 1).padStart(4, '0')}`,
  name: [
    'Dr. Anil Kumar', 'Mrs. Priya Singh', 'Mr. Suresh Sharma', 'Ms. Kavitha Rao',
    'Mr. Rajesh Mehta', 'Mrs. Sunita Verma', 'Mr. Deepak Joshi', 'Ms. Anjali Gupta',
    'Mr. Vikash Nair', 'Mrs. Pooja Reddy', 'Mr. Manish Tiwari', 'Ms. Rina Shah',
    'Mr. Sanjay Kapoor', 'Mrs. Rekha Bansal', 'Mr. Ashok Pandey', 'Ms. Meena Chauhan',
    'Mr. Rohit Saxena', 'Mrs. Geeta Kaur', 'Mr. Nitin Bose', 'Ms. Shweta Sinha',
  ][i],
  subject: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies',
    'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Physical Education',
    'Art', 'Music', 'History', 'Geography', 'Economics', 'Commerce',
    'Sanskrit', 'French', 'Environmental Science', 'Moral Science'][i],
  qualification: ['M.Sc', 'B.Ed', 'M.A', 'Ph.D', 'M.Phil'][i % 5],
  experience: `${(i % 15) + 2} Years`,
  phone: `97${String(10000000 + i * 9876543).slice(0, 8)}`,
  email: `teacher${i + 1}@school.edu`,
  address: `${i + 10} Teacher Colony, New Delhi`,
  salary: (35000 + i * 2500).toFixed(0),
  joiningDate: `202${i % 4}-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
  status: i % 8 === 0 ? 'inactive' : 'active',
  gender: i % 3 === 1 ? 'Female' : 'Male',
  avatar: null,
}));

// =============================================
// Mock Data — Staff
// =============================================
export const STAFF = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  employeeId: `STF${String(i + 1).padStart(4, '0')}`,
  name: [
    'Ram Prasad', 'Shyam Lal', 'Lakshmi Devi', 'Ganesh Singh', 'Radha Kumari',
    'Mohan Das', 'Hari Om', 'Saraswati Devi', 'Krishna Kumar', 'Durga Bai',
    'Suresh Bind', 'Kamla Devi', 'Ramu Kaka', 'Bina Devi', 'Sonu Patel',
  ][i],
  designation: ['Peon', 'Clerk', 'Accountant', 'Security Guard', 'Librarian',
    'Lab Assistant', 'Sports Coach', 'Driver', 'Cook', 'Sweeper',
    'Receptionist', 'IT Technician', 'Gardener', 'Nurse', 'Counselor'][i],
  department: ['Administration', 'Finance', 'Library', 'Security', 'Sports',
    'IT', 'Canteen', 'Maintenance', 'Medical', 'Transport'][i % 10],
  phone: `96${String(10000000 + i * 7654321).slice(0, 8)}`,
  email: `staff${i + 1}@school.edu`,
  salary: (15000 + i * 1500).toFixed(0),
  joiningDate: `202${i % 5}-0${(i % 8) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
  status: i % 6 === 0 ? 'inactive' : 'active',
  gender: i % 4 === 2 ? 'Female' : 'Male',
}));

// =============================================
// Mock Data — Fees
// =============================================
export const FEES = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  receiptNo: `FEE2024${String(i + 1).padStart(4, '0')}`,
  studentId: (i % 48) + 1,
  studentName: STUDENTS[i % 48].name,
  class: STUDENTS[i % 48].class,
  section: STUDENTS[i % 48].section,
  feeType: ['Tuition Fee', 'Transport Fee', 'Library Fee', 'Exam Fee', 'Sports Fee'][i % 5],
  amount: [8000, 1500, 500, 1000, 750][i % 5],
  paidAmount: i % 4 === 0 ? 0 : i % 4 === 2 ? [4000, 750, 250, 500, 375][i % 5] : [8000, 1500, 500, 1000, 750][i % 5],
  dueDate: `2024-${String((i % 12) + 1).padStart(2, '0')}-15`,
  paidDate: i % 4 !== 0 ? `2024-${String((i % 12) + 1).padStart(2, '0')}-10` : null,
  status: i % 4 === 0 ? 'unpaid' : i % 4 === 2 ? 'partial' : 'paid',
  month: ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'][i % 12],
}));

// =============================================
// Mock Data — Exams
// =============================================
export const EXAMS = [
  { id: 1, name: 'Unit Test 1', class: 'Class 8', subject: 'Mathematics', date: '2024-08-10', time: '10:00 AM', duration: '2 hrs', totalMarks: 50, status: 'completed' },
  { id: 2, name: 'Unit Test 1', class: 'Class 8', subject: 'Science', date: '2024-08-12', time: '10:00 AM', duration: '2 hrs', totalMarks: 50, status: 'completed' },
  { id: 3, name: 'Mid Term', class: 'Class 9', subject: 'English', date: '2024-09-15', time: '09:00 AM', duration: '3 hrs', totalMarks: 100, status: 'upcoming' },
  { id: 4, name: 'Mid Term', class: 'Class 10', subject: 'Mathematics', date: '2024-09-18', time: '09:00 AM', duration: '3 hrs', totalMarks: 100, status: 'upcoming' },
  { id: 5, name: 'Annual Exam', class: 'Class 10', subject: 'Science', date: '2024-12-10', time: '09:00 AM', duration: '3 hrs', totalMarks: 100, status: 'scheduled' },
  { id: 6, name: 'Annual Exam', class: 'Class 12', subject: 'Physics', date: '2024-12-12', time: '09:00 AM', duration: '3 hrs', totalMarks: 100, status: 'scheduled' },
];

// =============================================
// Dashboard Stats
// =============================================
export const DASHBOARD_STATS = {
  totalStudents: 1248,
  totalTeachers: 84,
  totalStaff: 32,
  todayAttendance: 94.2,
  monthlyFeeCollection: 3842500,
  monthlyExpenses: 1250000,
  pendingFees: 485000,
  activeClasses: 42,
};

// =============================================
// Chart Data
// =============================================
export const MONTHLY_REVENUE = [
  { month: 'Apr', income: 520000, expense: 180000 },
  { month: 'May', income: 480000, expense: 165000 },
  { month: 'Jun', income: 510000, expense: 175000 },
  { month: 'Jul', income: 490000, expense: 160000 },
  { month: 'Aug', income: 540000, expense: 190000 },
  { month: 'Sep', income: 520000, expense: 185000 },
  { month: 'Oct', income: 560000, expense: 200000 },
  { month: 'Nov', income: 530000, expense: 195000 },
  { month: 'Dec', income: 580000, expense: 210000 },
  { month: 'Jan', income: 600000, expense: 220000 },
  { month: 'Feb', income: 570000, expense: 205000 },
  { month: 'Mar', income: 620000, expense: 225000 },
];

export const ENROLLMENT_BY_CLASS = [
  { class: 'Nursery', students: 45 },
  { class: 'KG', students: 52 },
  { class: 'I', students: 68 },
  { class: 'II', students: 72 },
  { class: 'III', students: 81 },
  { class: 'IV', students: 78 },
  { class: 'V', students: 85 },
  { class: 'VI', students: 90 },
  { class: 'VII', students: 88 },
  { class: 'VIII', students: 92 },
  { class: 'IX', students: 95 },
  { class: 'X', students: 98 },
  { class: 'XI', students: 75 },
  { class: 'XII', students: 70 },
];

export const ATTENDANCE_DISTRIBUTION = [
  { name: 'Present', value: 1174, color: '#22C55E' },
  { name: 'Absent', value: 52, color: '#EF4444' },
  { name: 'Late', value: 22, color: '#F97316' },
];

// =============================================
// Recent Activities
// =============================================
export const RECENT_ACTIVITIES = [
  { id: 1, type: 'admission', message: 'New student Aarav Sharma admitted to Class 8A', time: '10 minutes ago', icon: 'user-add' },
  { id: 2, type: 'fee', message: 'Fee payment received from Diya Patel – ₹8,000', time: '25 minutes ago', icon: 'cash' },
  { id: 3, type: 'exam', message: 'Unit Test 1 results published for Class 8', time: '1 hour ago', icon: 'document' },
  { id: 4, type: 'leave', message: 'Teacher Mr. Anil Kumar applied for 2 days leave', time: '2 hours ago', icon: 'calendar' },
  { id: 5, type: 'notice', message: 'Annual Sports Day notice published', time: '3 hours ago', icon: 'bell' },
  { id: 6, type: 'fee', message: 'Fee overdue alert for 12 students in Class 10', time: '5 hours ago', icon: 'warning' },
];

// =============================================
// Notices
// =============================================
export const NOTICES = [
  { id: 1, title: 'Annual Sports Day – 15th August', date: '2024-08-01', priority: 'high', type: 'event' },
  { id: 2, title: 'Parent-Teacher Meeting – 20th August', date: '2024-08-05', priority: 'high', type: 'meeting' },
  { id: 3, title: 'Holiday: Independence Day', date: '2024-08-10', priority: 'medium', type: 'holiday' },
  { id: 4, title: 'Fee Payment Deadline Extended', date: '2024-08-12', priority: 'medium', type: 'fee' },
  { id: 5, title: 'New Library Books Available', date: '2024-08-15', priority: 'low', type: 'library' },
];

// =============================================
// Quick Actions
// =============================================
export const QUICK_ACTIONS = [
  { id: 1, label: 'Add Student', path: '/students/add', color: 'primary' },
  { id: 2, label: 'Mark Attendance', path: '/attendance/mark', color: 'secondary' },
  { id: 3, label: 'Collect Fee', path: '/fees/collect', color: 'accent' },
  { id: 4, label: 'Add Teacher', path: '/teachers/add', color: 'success' },
  { id: 5, label: 'Schedule Exam', path: '/exams/add', color: 'warning' },
  { id: 6, label: 'View Reports', path: '/reports', color: 'primary' },
];
