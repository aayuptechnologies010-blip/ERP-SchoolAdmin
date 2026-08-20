import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import {
  HiOutlineArrowLeft, HiOutlineAcademicCap, HiOutlineClock,
  HiOutlineClipboardList, HiOutlineCalendar, HiOutlineOfficeBuilding,
} from 'react-icons/hi';
import { PageHeader } from '../../components/common/PageHeader';
import { Input, Select, Textarea, Button, Card } from '../../components/ui';
import { notify } from '../../utils/notify';
import { dialog } from '../../utils/dialog';
import { APP_NAME, CLASS_OPTIONS, SUBJECT_OPTIONS, SECTION_OPTIONS } from '../../constants';

const schema = yup.object({
  name: yup.string().required('Exam name is required'),
  examType: yup.string().required('Exam type is required'),
  class: yup.string().required('Class is required'),
  section: yup.string().required('Section is required'),
  subject: yup.string().required('Subject is required'),
  date: yup.string().required('Exam date is required'),
  startTime: yup.string().required('Start time is required'),
  duration: yup.string().required('Duration is required'),
  totalMarks: yup.number().typeError('Must be a number').required('Total marks required').min(1),
  passingMarks: yup.number().typeError('Must be a number').required('Passing marks required').min(1),
  venue: yup.string().required('Venue / Room is required'),
});

const EXAM_TYPE_OPTIONS = [
  { value: 'unit-test', label: 'Unit Test' },
  { value: 'monthly', label: 'Monthly Test' },
  { value: 'mid-term', label: 'Mid-Term Exam' },
  { value: 'pre-board', label: 'Pre-Board Exam' },
  { value: 'annual', label: 'Annual Exam' },
  { value: 'practical', label: 'Practical Exam' },
  { value: 'project', label: 'Project Assessment' },
  { value: 'oral', label: 'Oral / Viva' },
];

const DURATION_OPTIONS = [
  { value: '30 min', label: '30 Minutes' },
  { value: '1 hr', label: '1 Hour' },
  { value: '1.5 hrs', label: '1.5 Hours' },
  { value: '2 hrs', label: '2 Hours' },
  { value: '2.5 hrs', label: '2.5 Hours' },
  { value: '3 hrs', label: '3 Hours' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.28 } }),
};

export default function ExamFormPage({ isEdit = false }) {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { totalMarks: 100, passingMarks: 33, section: 'all' },
  });

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 800));
    notify.success(isEdit ? 'Exam updated!' : 'Exam scheduled successfully!');
    navigate('/exams');
  };

  const handleReset = async () => {
    const r = await dialog.confirm({ title: 'Reset?', text: 'All data will be cleared.', confirmText: 'Yes, Reset', icon: 'warning' });
    if (r.isConfirmed) reset();
  };

  const totalMarks = watch('totalMarks');

  return (
    <>
      <Helmet><title>{isEdit ? 'Edit Exam' : 'Schedule Exam'} — {APP_NAME}</title></Helmet>
      <PageHeader
        title={isEdit ? 'Edit Exam' : 'Schedule New Exam'}
        subtitle="Add exam details, timings, and marks"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Exams', path: '/exams' },
          { label: isEdit ? 'Edit Exam' : 'Add Exam', path: '' },
        ]}
        actions={<Button variant="outline" icon={HiOutlineArrowLeft} onClick={() => navigate('/exams')}>Back</Button>}
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-5">

            {/* Exam Info */}
            <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
              <Card>
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center">
                    <HiOutlineAcademicCap className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="section-title text-base">Exam Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Input label="Exam Name / Title" placeholder="e.g. Unit Test 1 – Mathematics" required error={errors.name?.message} {...register('name')} />
                  </div>
                  <Select label="Exam Type" options={EXAM_TYPE_OPTIONS} required error={errors.examType?.message} {...register('examType')} />
                  <Select label="Subject" placeholder="Select subject" options={SUBJECT_OPTIONS} required error={errors.subject?.message} {...register('subject')} />
                  <Select label="Class" placeholder="Select class" options={CLASS_OPTIONS} required error={errors.class?.message} {...register('class')} />
                  <div>
                    <label className="form-label">Section <span className="text-danger">*</span></label>
                    <select className="form-input" {...register('section')}>
                      <option value="all">All Sections</option>
                      {['A', 'B', 'C', 'D'].map((s) => <option key={s} value={s}>Section {s}</option>)}
                    </select>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Schedule */}
            <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
              <Card>
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 bg-secondary-100 dark:bg-secondary-900/20 rounded-xl flex items-center justify-center">
                    <HiOutlineCalendar className="w-4 h-4 text-secondary" />
                  </div>
                  <h3 className="section-title text-base">Schedule & Venue</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Exam Date" type="date" required error={errors.date?.message} {...register('date')} />
                  <Input label="Start Time" type="time" required error={errors.startTime?.message} {...register('startTime')} />
                  <Select label="Duration" options={DURATION_OPTIONS} required error={errors.duration?.message} {...register('duration')} />
                  <Input label="Venue / Room No." placeholder="e.g. Room 204, Science Lab" required error={errors.venue?.message} {...register('venue')} />
                  <Input label="Invigilator Name" placeholder="Assigned teacher name" {...register('invigilator')} />
                  <Input label="Seating Capacity" type="number" placeholder="e.g. 40" min="1" {...register('capacity')} />
                </div>
              </Card>
            </motion.div>

            {/* Marks */}
            <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
              <Card>
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 bg-accent-100 dark:bg-amber-900/20 rounded-xl flex items-center justify-center">
                    <HiOutlineClipboardList className="w-4 h-4 text-accent" />
                  </div>
                  <h3 className="section-title text-base">Marks & Grading</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input label="Total Marks" type="number" min="1" required error={errors.totalMarks?.message} {...register('totalMarks')} />
                  <Input label="Passing Marks" type="number" min="1" required error={errors.passingMarks?.message} {...register('passingMarks')} />
                  <div>
                    <label className="form-label">Pass %</label>
                    <div className="form-input bg-gray-50 dark:bg-gray-700/50 text-erp-muted cursor-not-allowed">
                      {totalMarks ? `${Math.round((Number(watch('passingMarks')) / Number(totalMarks)) * 100)}%` : '—'}
                    </div>
                  </div>
                </div>

                {/* Grade Scale */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { grade: 'A+', range: '91–100', color: 'text-success' },
                    { grade: 'A', range: '75–90', color: 'text-primary' },
                    { grade: 'B', range: '60–74', color: 'text-secondary' },
                    { grade: 'C', range: '33–59', color: 'text-warning' },
                  ].map((g) => (
                    <div key={g.grade} className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-2.5 text-center">
                      <p className={`text-lg font-bold font-heading ${g.color}`}>{g.grade}</p>
                      <p className="text-caption text-erp-muted">{g.range}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Instructions */}
            <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
              <Card>
                <h3 className="section-title text-base mb-4">Instructions / Notes</h3>
                <Textarea placeholder="Special instructions for students or invigilators..." rows={4} {...register('instructions')} />
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Preview Card */}
            <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
              <Card className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary/20">
                <h3 className="section-title text-sm mb-4 text-primary">Exam Preview</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'Exam', value: watch('name') || '—' },
                    { label: 'Class', value: watch('class') ? `${watch('class')} (Sec ${watch('section')})` : '—' },
                    { label: 'Subject', value: watch('subject') || '—' },
                    { label: 'Date', value: watch('date') || '—' },
                    { label: 'Time', value: watch('startTime') ? `${watch('startTime')} (${watch('duration') || '—'})` : '—' },
                    { label: 'Marks', value: watch('totalMarks') ? `${watch('totalMarks')} (Pass: ${watch('passingMarks')})` : '—' },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between gap-2">
                      <span className="text-erp-muted dark:text-erp-dark-text flex-shrink-0">{row.label}</span>
                      <span className="font-medium text-erp-heading dark:text-erp-dark-heading text-right truncate">{row.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
              <Card>
                <h3 className="section-title text-sm mb-3">Notifications</h3>
                {[
                  { label: 'Notify Students', key: 'notifyStudents' },
                  { label: 'Notify Parents via SMS', key: 'notifyParents' },
                  { label: 'Send Email Notification', key: 'notifyEmail' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center justify-between py-2.5 border-b border-erp-border/50 dark:border-erp-dark-border/50 last:border-0 cursor-pointer">
                    <span className="text-sm text-erp-text dark:text-erp-dark-text">{item.label}</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-primary" {...register(item.key)} />
                  </label>
                ))}
              </Card>
            </motion.div>

            {/* Actions */}
            <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
              <Card>
                <div className="space-y-2.5">
                  <Button type="submit" variant="primary" loading={isSubmitting} className="w-full">
                    {isEdit ? 'Update Exam' : 'Schedule Exam'}
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={handleReset}>Reset</Button>
                  <Button type="button" variant="ghost" className="w-full" onClick={() => navigate('/exams')}>Cancel</Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </form>
    </>
  );
}
