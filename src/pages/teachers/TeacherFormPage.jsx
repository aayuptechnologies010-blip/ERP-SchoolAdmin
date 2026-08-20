import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { PageHeader } from '../../components/common/PageHeader';
import { Input, Select, Textarea, Button, Card } from '../../components/ui';
import { dialog } from '../../utils/dialog';
import { notify } from '../../utils/notify';
import { GENDER_OPTIONS, SUBJECT_OPTIONS, APP_NAME } from '../../constants';
import api from '../../api/api';

const QUALIFICATION_OPTIONS = [
  { value: 'B.Ed', label: 'B.Ed' },
  { value: 'M.Ed', label: 'M.Ed' },
  { value: 'B.Sc', label: 'B.Sc' },
  { value: 'M.Sc', label: 'M.Sc' },
  { value: 'B.A', label: 'B.A' },
  { value: 'M.A', label: 'M.A' },
  { value: 'B.Com', label: 'B.Com' },
  { value: 'M.Com', label: 'M.Com' },
  { value: 'PhD', label: 'PhD' },
  { value: 'Other', label: 'Other' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const baseShape = {
  name: yup.string().required('Full name is required').min(3, 'Name must be at least 3 characters'),
  email: yup.string().email('Enter a valid email address').required('Email is required'),
  phone: yup.string().required('Phone number is required').matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  gender: yup.string().required('Gender is required'),
  subject: yup.string().required('Subject is required'),
  qualification: yup.string().required('Qualification is required'),
  experience: yup.string().required('Experience is required'),
  salary: yup.number().typeError('Salary must be a number').required('Salary is required').min(5000, 'Minimum salary is ₹5,000'),
  joiningDate: yup.string().required('Joining date is required'),
  address: yup.string().required('Address is required'),
  employeeId: yup.string().required('Employee ID is required'),
};
const addSchema = yup.object({
  ...baseShape,
  password: yup.string().required('A login password is required for the teacher').min(6, 'At least 6 characters'),
});
const editSchema = yup.object(baseShape);

// Backend gender enum is 'Male' | 'Female' | 'Other', GENDER_OPTIONS values are lowercase.
const toBackendGender = (v) => (v ? v.charAt(0).toUpperCase() + v.slice(1) : '');
const toFormGender = (v) => (v ? v.toLowerCase() : '');

export default function TeacherFormPage({ isEdit = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loadingTeacher, setLoadingTeacher] = useState(isEdit);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [userId, setUserId] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(isEdit ? editSchema : addSchema),
    defaultValues: {
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'active',
    },
  });

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return notify.error('Please select an image file');
    if (file.size > 5 * 1024 * 1024) return notify.error('Photo must be smaller than 5MB');
    setUploadingPhoto(true);
    try {
      const avatar = await new Promise((resolve, reject) => {
        const reader = new FileReader(); const image = new Image();
        reader.onload = () => { image.onload = () => { const max=512, scale=Math.min(1,max/Math.max(image.width,image.height)); const c=document.createElement('canvas'); c.width=Math.max(1,Math.round(image.width*scale)); c.height=Math.max(1,Math.round(image.height*scale)); const ctx=c.getContext('2d'); if(!ctx)return reject(new Error('Could not process image')); ctx.drawImage(image,0,0,c.width,c.height); resolve(c.toDataURL('image/jpeg',0.82)); }; image.onerror=()=>reject(new Error('Invalid image file')); image.src=reader.result; }; reader.onerror=()=>reject(new Error('Could not read image')); reader.readAsDataURL(file);
      });
      setAvatarUrl(avatar); notify.success(isEdit?'Photo selected. Save to apply it.':'Photo selected. It will be saved with the teacher.');
    } catch(err){ notify.error(err.message||'Photo upload failed'); } finally { setUploadingPhoto(false); e.target.value=''; }
  };

  useEffect(() => {
    if (!isEdit || !id) return;
    (async () => {
      try {
        const { data } = await api.get(`/teachers/${id}`);
        const t = data.data;
        reset({
          name: t.user?.name || '',
          email: t.user?.email || '',
          phone: t.user?.phone || '',
          gender: toFormGender(t.gender),
          subject: (t.subjects && t.subjects[0]) || '',
          qualification: t.qualification || '',
          experience: t.experience || '',
          salary: t.salary || 0,
          joiningDate: t.joiningDate ? t.joiningDate.split('T')[0] : '',
          address: t.address || '',
          employeeId: t.employeeId || '',
          status: t.status || 'active',
        });
        setAvatarUrl(t.user?.avatar || '');
        setUserId(t.user?._id || null);
      } catch (err) {
        notify.error(err.message);
        navigate('/teachers');
      } finally {
        setLoadingTeacher(false);
      }
    })();
  }, [isEdit, id, reset, navigate]);

  const onSubmit = async (data) => {
    const payload = {
      employeeId: data.employeeId,
      subjects: [data.subject],
      qualification: data.qualification,
      experience: data.experience,
      gender: toBackendGender(data.gender),
      address: data.address,
      salary: Number(data.salary),
      joiningDate: data.joiningDate,
      status: data.status,
    };
    try {
      if (isEdit) {
        await api.put(`/teachers/${id}`, payload);
        notify.success('Teacher updated successfully!');
      } else {
        const { data: created } = await api.post('/teachers', {
          ...payload,
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
        });
        // Teacher was created with a fresh linked User account - if a photo
        // was picked before saving, attach it to that new account now.
        const newUserId = created.data?.user;
        if (avatarUrl && newUserId) await api.put(`/users/${newUserId}`, { avatar: avatarUrl });
        notify.success('Teacher added successfully!');
      }
      navigate('/teachers');
    } catch (err) {
      notify.error(err.message);
    }
  };

  const handleReset = async () => {
    const result = await dialog.confirm({ title: 'Reset Form?', text: 'All entered data will be cleared.', confirmText: 'Yes, Reset', icon: 'warning' });
    if (result.isConfirmed) reset();
  };

  if (loadingTeacher) {
    return <div className="py-20 text-center text-erp-muted">Loading teacher...</div>;
  }

  return (
    <>
      <Helmet><title>{isEdit ? 'Edit Teacher' : 'Add Teacher'} — {APP_NAME}</title></Helmet>
      <PageHeader
        title={isEdit ? 'Edit Teacher' : 'Add New Teacher'}
        subtitle={isEdit ? 'Update teacher information' : 'Fill in the details to add a new teacher'}
        actions={
          <Button variant="outline" icon={HiOutlineArrowLeft} onClick={() => navigate('/teachers')}>
            Back to List
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <h3 className="section-title text-base mb-5">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input label="Full Name" placeholder="Enter teacher's full name" required error={errors.name?.message} {...register('name')} />
                </div>
                <Select label="Gender" placeholder="Select gender" options={GENDER_OPTIONS} required error={errors.gender?.message} {...register('gender')} />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="teacher@school.edu"
                  required
                  disabled={isEdit}
                  hint={isEdit ? 'Login email cannot be changed here' : "This becomes the teacher's login email"}
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input label="Phone Number" type="tel" placeholder="10-digit mobile number" required error={errors.phone?.message} {...register('phone')} />
                {!isEdit && (
                  <Input
                    label="Login Password"
                    type="password"
                    placeholder="Set an initial password"
                    required
                    hint="Teacher will use this to log into the Teacher Panel"
                    error={errors.password?.message}
                    {...register('password')}
                  />
                )}
              </div>
            </Card>

            <Card>
              <h3 className="section-title text-base mb-5">Professional Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Employee ID" placeholder="e.g. TCH-0021" required error={errors.employeeId?.message} {...register('employeeId')} />
                <Select label="Subject" placeholder="Select subject" options={SUBJECT_OPTIONS} required error={errors.subject?.message} {...register('subject')} />
                <Select label="Qualification" placeholder="Select qualification" options={QUALIFICATION_OPTIONS} required error={errors.qualification?.message} {...register('qualification')} />
                <Input label="Experience" placeholder="e.g. 5 years" required error={errors.experience?.message} {...register('experience')} />
                <Input label="Joining Date" type="date" required error={errors.joiningDate?.message} {...register('joiningDate')} />
                <Input label="Monthly Salary (₹)" type="number" placeholder="e.g. 30000" required min="5000" error={errors.salary?.message} {...register('salary')} />
              </div>
            </Card>

            <Card>
              <h3 className="section-title text-base mb-5">Address</h3>
              <Textarea label="Residential Address" placeholder="Enter full address" rows={3} required error={errors.address?.message} {...register('address')} />
            </Card>
          </div>

          <div className="space-y-5">
            <Card>
              <h3 className="section-title text-base mb-4">Photo</h3>
              <div className="border-2 border-dashed border-erp-border dark:border-erp-dark-border rounded-xl p-6 text-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Teacher" className="w-20 h-20 rounded-full object-cover mx-auto mb-3" />
                ) : (
                  <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <HiOutlineArrowLeft className="w-8 h-8 text-primary rotate-90" />
                  </div>
                )}
                <p className="text-sm text-erp-muted dark:text-erp-dark-text mb-2">
                  {uploadingPhoto ? 'Uploading...' : 'Upload teacher photo'}
                </p>
                <label className="btn-outline btn btn-sm cursor-pointer inline-block">
                  Choose File
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} disabled={uploadingPhoto} />
                </label>
                {!isEdit && avatarUrl && (
                  <p className="text-caption text-erp-muted mt-2">Photo will be attached once you save the teacher.</p>
                )}
              </div>
            </Card>

            <Card>
              <h3 className="section-title text-base mb-4">Status</h3>
              <Select label="Employment Status" options={STATUS_OPTIONS} {...register('status')} />
            </Card>

            <Card>
              <h3 className="section-title text-base mb-4">Actions</h3>
              <div className="space-y-3">
                <Button type="submit" variant="primary" loading={isSubmitting} className="w-full">
                  {isEdit ? 'Update Teacher' : 'Save Teacher'}
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={handleReset}>
                  Reset Form
                </Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => navigate('/teachers')}>
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </>
  );
}
