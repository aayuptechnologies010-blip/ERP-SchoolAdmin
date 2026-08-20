import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import {
  HiOutlineUsers, HiOutlineAcademicCap, HiOutlineUserGroup,
  HiOutlineClipboardList, HiOutlineCurrencyRupee, HiOutlinePlus,
  HiOutlineTrendingUp, HiOutlineBell, HiOutlineLightningBolt,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/PageHeader';
import { Avatar, StatusChip } from '../../components/ui';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { APP_NAME } from '../../constants';
import api from '../../api/api';
import dayjs from 'dayjs';

const ATTENDANCE_COLORS = { present: '#22C55E', absent: '#EF4444', late: '#F97316', leave: '#94A3B8' };

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-erp-dark-card border border-erp-border dark:border-erp-dark-border rounded-xl shadow-dropdown p-3 text-sm">
      <p className="font-semibold text-erp-heading dark:text-erp-dark-heading mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { user } = useAuth();
  const hour = dayjs().hour();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const today = dayjs().format('dddd, MMMM D, YYYY');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const [recentStudents, setRecentStudents] = useState([]);
  const [enrollmentByClass, setEnrollmentByClass] = useState([]);
  const [feeTotals, setFeeTotals] = useState({ collected: 0, pending: 0 });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const [dashboardRes, studentsRes, pendingFeesRes, financeRes] = await Promise.all([
          api.get('/dashboard/admin'),
          api.get('/students', { params: { limit: 1000, sort: '-createdAt' } }),
          api.get('/fees/pending').catch(() => ({ data: { data: [] } })),
          api.get('/finance/report').catch(() => ({ data: { data: { feeCollected: 0 } } })),
        ]);
        if (cancelled) return;

        setSummary(dashboardRes.data.data);

        const students = studentsRes.data.data || [];
        setRecentStudents(students.slice(0, 5));

        const classCounts = {};
        students.forEach((s) => {
          const key = s.class || 'Unknown';
          classCounts[key] = (classCounts[key] || 0) + 1;
        });
        setEnrollmentByClass(
          Object.entries(classCounts)
            .map(([cls, count]) => ({ class: cls, students: count }))
            .sort((a, b) => a.class.localeCompare(b.class))
        );

        const pendingRecords = pendingFeesRes.data.data || [];
        const pendingTotal = pendingRecords.reduce(
          (sum, r) => sum + (r.amount + (r.fine || 0) - (r.discount || 0) - (r.scholarship || 0) - (r.paidAmount || 0)),
          0
        );
        setFeeTotals({
          collected: financeRes.data.data?.feeCollected || 0,
          pending: pendingTotal,
        });
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const attendanceDistribution = (summary?.todayAttendance || []).map((a) => ({
    name: a._id ? a._id.charAt(0).toUpperCase() + a._id.slice(1) : 'Unknown',
    value: a.count,
    color: ATTENDANCE_COLORS[a._id] || '#94A3B8',
  }));
  const totalMarkedToday = attendanceDistribution.reduce((s, a) => s + a.value, 0);
  const presentToday = attendanceDistribution.find((a) => a.name === 'Present')?.value || 0;
  const attendancePct = totalMarkedToday ? ((presentToday / totalMarkedToday) * 100).toFixed(1) : '—';

  const stats = [
    { title: 'Total Students', value: summary?.totalStudents ?? '—', icon: HiOutlineUsers, color: 'primary' },
    { title: 'Total Teachers', value: summary?.totalTeachers ?? '—', icon: HiOutlineAcademicCap, color: 'secondary' },
    { title: 'Staff Members', value: summary?.totalStaff ?? '—', icon: HiOutlineUserGroup, color: 'accent' },
    { title: "Today's Attendance", value: totalMarkedToday ? `${attendancePct}%` : 'Not marked yet', icon: HiOutlineClipboardList, color: 'success' },
    { title: 'Fee Collected', value: formatCurrency(feeTotals.collected), icon: HiOutlineCurrencyRupee, color: 'primary' },
    { title: 'Pending Fees', value: formatCurrency(feeTotals.pending), icon: HiOutlineTrendingUp, color: 'warning' },
  ];

  return (
    <>
      <Helmet><title>Dashboard — {APP_NAME}</title></Helmet>

      <div className="space-y-6">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-card bg-gradient-to-r from-primary-600 via-primary to-primary-700 text-white p-6 sm:p-8"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/5 rounded-full" />
            <div className="absolute -right-4 -bottom-8 w-32 h-32 bg-white/5 rounded-full" />
            <div className="absolute right-32 top-4 w-20 h-20 bg-white/5 rounded-full" />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-primary-100 text-sm font-medium mb-1">{today}</p>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-1">
                {greeting}, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-primary-100 text-sm">Here's what's happening at your school today.</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link to="/students/add" className="btn bg-white/15 hover:bg-white/25 text-white border-0 backdrop-blur-sm text-sm">
                <HiOutlinePlus className="w-4 h-4" /> Add Student
              </Link>
              <Link to="/attendance/mark" className="btn bg-white text-primary hover:bg-primary-50 text-sm">
                <HiOutlineClipboardList className="w-4 h-4" /> Mark Attendance
              </Link>
            </div>
          </div>
        </motion.div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">
            Couldn't load dashboard data: {error}
          </div>
        )}

        {/* Stats Grid */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.07 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div key={i} variants={{ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Bar Chart - Enrollment by class (real data) */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="section-title">Student Enrollment by Class</h3>
                <p className="text-sm text-erp-muted dark:text-erp-dark-text mt-0.5">Live count from enrolled students</p>
              </div>
            </div>
            {enrollmentByClass.length === 0 ? (
              <p className="text-sm text-erp-muted py-10 text-center">{loading ? 'Loading...' : 'No students enrolled yet.'}</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={enrollmentByClass} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} vertical={false} />
                  <XAxis dataKey="class" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="students" name="Students" fill="#2563EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Pie Chart - Attendance (real data) */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card p-6">
            <h3 className="section-title mb-1">Today's Attendance</h3>
            <p className="text-sm text-erp-muted dark:text-erp-dark-text mb-4">
              {totalMarkedToday ? `${totalMarkedToday} students marked` : 'No attendance marked yet today'}
            </p>
            {attendanceDistribution.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={attendanceDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                      {attendanceDistribution.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [v, '']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-1">
                  {attendanceDistribution.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                        <span className="text-erp-text dark:text-erp-dark-text">{item.name}</span>
                      </span>
                      <span className="font-semibold text-erp-heading dark:text-erp-dark-heading">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-erp-muted py-10 text-center">
                <Link to="/attendance/mark" className="text-primary hover:underline">Mark today's attendance</Link> to see this chart.
              </p>
            )}
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Recent Admissions (real data) */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="lg:col-span-2 card p-0 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-erp-border dark:border-erp-dark-border">
              <h3 className="section-title">Recent Admissions</h3>
              <Link to="/students" className="text-sm text-primary font-medium hover:underline">View all</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Student</th><th>Class</th><th>Admission Date</th><th>Fees</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentStudents.length === 0 && !loading && (
                    <tr><td colSpan={5} className="text-center text-erp-muted py-6">No students yet</td></tr>
                  )}
                  {recentStudents.map((s) => (
                    <tr key={s._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <Avatar name={s.user?.name} size="sm" />
                          <div>
                            <p className="font-medium text-erp-heading dark:text-erp-dark-heading text-sm">{s.user?.name}</p>
                            <p className="text-caption text-erp-muted">{s.rollNo}</p>
                          </div>
                        </div>
                      </td>
                      <td>{s.class} – {s.section}</td>
                      <td>{formatDate(s.admissionDate)}</td>
                      <td><StatusChip status={s.feeStatus} /></td>
                      <td><StatusChip status={s.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Notices & Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-5">
            <div className="card p-0 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-erp-border dark:border-erp-dark-border">
                <h3 className="section-title text-sm">Latest Notices</h3>
                <HiOutlineBell className="w-4 h-4 text-erp-muted" />
              </div>
              <div className="divide-y divide-erp-border dark:divide-erp-dark-border">
                {(summary?.recentNotices || []).length === 0 && (
                  <p className="px-5 py-4 text-sm text-erp-muted">{loading ? 'Loading...' : 'No notices yet'}</p>
                )}
                {(summary?.recentNotices || []).map((notice) => (
                  <div key={notice._id} className="px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <p className="text-sm text-erp-heading dark:text-erp-dark-heading font-medium leading-snug">{notice.title}</p>
                    <p className="text-caption text-erp-muted dark:text-erp-dark-text mt-0.5">{formatDate(notice.createdAt)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="section-title text-sm mb-3 flex items-center gap-2">
                <HiOutlineLightningBolt className="w-4 h-4 text-accent" /> Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['Add Student','/students/add'],['Add Teacher','/teachers/add'],['Collect Fee','/fees/collect'],['Mark Attendance','/attendance/mark']
                ].map(([label,path]) => (
                  <Link key={path} to={path} className="flex items-center justify-center text-center px-2 py-2.5 rounded-xl text-xs font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-100">{label}</Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
