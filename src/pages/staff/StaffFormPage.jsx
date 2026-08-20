import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { PageHeader } from '../../components/common/PageHeader';
import { Input, Select, Button, Card } from '../../components/ui';
import { dialog } from '../../utils/dialog';
import { notify } from '../../utils/notify';
import { GENDER_OPTIONS, APP_NAME } from '../../constants';
import api from '../../api/api';

const DESIGNATION_OPTIONS = [
  { value: 'Peon', label: 'Peon' },
  { value: 'Clerk', label: 'Clerk' },
  { value: 'Accountant', label: 'Accountant' },
  { value: 'Security Guard', label: 'Security Guard' },
  { value: 'Librarian', label: 'Librarian' },
  { value: 'Lab Assistant', label: 'Lab Assistant' },
  { value: 'Sports Coach', label: 'Sports Coach' },
  { value: 'Driver', label: 'Driver' },
  { value: 'Cook / Canteen Staff', label: 'Cook / Canteen Staff' },
  { value: 'Sweeper / Cleaning Staff', label: 'Sweeper / Cleaning Staff' },
  { value: 'Receptionist', label: 'Receptionist' },
  { value: 'IT Technician', label: 'IT Technician' },
  { value: 'Gardener', label: 'Gardener' },
  { value: 'Nurse / Medical Staff', label: 'Nurse / Medical Staff' },
  { value: 'Counselor', label: 'Counselor' },
  { value: 'Other', label: 'Other' },
];

const DEPARTMENT_OPTIONS = [
  { value: 'Administration', label: 'Administration' },
  { value: 'Finance & Accounts', label: 'Finance & Accounts' },
  { value: 'Library', label: 'Library' },
  { value: 'Security', label: 'Security' },
  { value: 'Sports & Recreation', label: 'Sports & Recreation' },
  { value: 'IT & Technology', label: 'IT & Technology' },
  { value: 'Canteen / Kitchen', label: 'Canteen / Kitchen' },
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'Medical / Health', label: 'Medical / Health' },
  { value: 'Transport', label: 'Transport' },
  { value: 'Housekeeping', label: 'Housekeeping' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const baseShape = {
  name: yup.string().required('Full name is required').min(3, 'At least 3 characters'),
  email: yup.string().email('Enter a valid email').required('Email is required (used for staff login)'),
  phone: yup.string().required('Phone number is required').matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  gender: yup.string().required('Gender is required'),
  designation: yup.string().required('Designation is required'),
  department: yup.string().required('Department is required'),
  salary: yup.number().typeError('Salary must be a number').required('Salary is required').min(1000, 'Minimum salary is ₹1,000'),
  joiningDate: yup.string().required('Joining date is required'),
  employeeId: yup.string().required('Employee ID is required'),
};
const addSchema = yup.object({
  ...baseShape,
  password: yup.string().required('A login password is required for the staff member').min(6, 'At least 6 characters'),
});
const editSchema = yup.object(baseShape);

// Backend gender enum is 'Male' | 'Female' | 'Other', GENDER_OPTIONS values are lowercase.
const toBackendGender = (v) => (v ? v.charAt(0).toUpperCase() + v.slice(1) : '');
const toFormGender = (v) => (v ? v.toLowerCase() : '');

export default function StaffFormPage({ isEdit = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loadingStaff, setLoadingStaff] = useState(isEdit);
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
    const file=e.target.files?.[0]; if(!file)return;
    if(!file.type.startsWith('image/'))return notify.error('Please select an image file');
    if(file.size>5*1024*1024)return notify.error('Photo must be smaller than 5MB');
    setUploadingPhoto(true);
    try{const avatar=await new Promise((resolve,reject)=>{const reader=new FileReader();const image=new Image();reader.onload=()=>{image.onload=()=>{const max=512,scale=Math.min(1,max/Math.max(image.width,image.height));const c=document.createElement('canvas');c.width=Math.max(1,Math.round(image.width*scale));c.height=Math.max(1,Math.round(image.height*scale));const ctx=c.getContext('2d');if(!ctx)return reject(new Error('Could not process image'));ctx.drawImage(image,0,0,c.width,c.height);resolve(c.toDataURL('image/jpeg',0.82));};image.onerror=()=>reject(new Error('Invalid image file'));image.src=reader.result};reader.onerror=()=>reject(new Error('Could not read image'));reader.readAsDataURL(file)});setAvatarUrl(avatar);notify.success(isEdit?'Photo selected. Save to apply it.':'Photo selected. It will be saved with the staff member.')}catch(err){notify.error(err.message||'Photo upload failed')}finally{setUploadingPhoto(false);e.target.value=''}
  };

  useEffect(() => {
    if (!isEdit || !id) return;
    (async () => {
      try {
        const { data } = await api.get(`/staff/${id}`);
        const s = data.data;
        reset({
          name: s.user?.name || '',
          email: s.user?.email || '',
          phone: s.user?.phone || '',
          gender: toFormGender(s.gender),
          designation: s.designation || '',
          department: s.department || '',
          salary: s.salary || 0,
          joiningDate: s.joiningDate ? s.joiningDate.split('T')[0] : '',
          employeeId: s.employeeId || '',
          status: s.status || 'active',
        });
        setAvatarUrl(s.user?.avatar || '');
        setUserId(s.user?._id || null);
      } catch (err) {
        notify.error(err.message);
        navigate('/staff');
      } finally {
        setLoadingStaff(false);
      }
    })();
  }, [isEdit, id, reset, navigate]);

  const onSubmit = async (data) => {
    const payload = {
      employeeId: data.employeeId,
      designation: data.designation,
      department: data.department,
      gender: toBackendGender(data.gender),
      salary: Number(data.salary),
      joiningDate: data.joiningDate,
      status: data.status,
    };
    try {
      if (isEdit) {
        await api.put(`/staff/${id}`, payload);
        notify.success('Staff member updated successfully!');
      } else {
        const { data: created } = await api.post('/staff', {
          ...payload,
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
        });
        // Staff was created with a fresh linked User account - if a photo
        // was picked before saving, attach it to that new account now.
        const newUserId = created.data?.user;
        if (avatarUrl && newUserId) await api.put(`/users/${newUserId}`, { avatar: avatarUrl });
        notify.success('Staff member added successfully!');
      }
      navigate('/staff');
    } catch (err) {
      notify.error(err.message);
    }
  };

  const handleReset = async () => {
    const result = await dialog.confirm({ title: 'Reset Form?', text: 'All entered information will be cleared.', confirmText: 'Yes, Reset', icon: 'warning' });
    if (result.isConfirmed) reset();
  };

  if (loadingStaff) {
    return <div className="py-20 text-center text-erp-muted">Loading staff member...</div>;
  }

  return (
    <>
      <Helmet><title>{isEdit ? 'Edit Staff' : 'Add Staff Member'} — {APP_NAME}</title></Helmet>
      <PageHeader
        title={isEdit ? 'Edit Staff Member' : 'Add New Staff Member'}
        subtitle={isEdit ? 'Update staff member details' : 'Fill in the details to register a new non-teaching staff member'}
        actions={
          <Button variant="outline" icon={HiOutlineArrowLeft} onClick={() => navigate('/staff')}>
            Back to List
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-5">
            <Card>
              <h3 className="section-title text-base mb-5">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input label="Full Name" placeholder="e.g. Ram Prasad" required error={errors.name?.message} {...register('name')} />
                </div>
                <Select label="Gender" placeholder="Select gender" options={GENDER_OPTIONS} required error={errors.gender?.message} {...register('gender')} />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="staff@school.edu"
                  required
                  disabled={isEdit}
                  hint={isEdit ? 'Login email cannot be changed here' : "This becomes the staff member's login email"}
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input label="Mobile Number" type="tel" placeholder="10-digit mobile number" required error={errors.phone?.message} {...register('phone')} />
                {!isEdit && (
                  <Input
                    label="Login Password"
                    type="password"
                    placeholder="Set an initial password"
                    required
                    hint="Staff member will use this to log in"
                    error={errors.password?.message}
                    {...register('password')}
                  />
                )}
              </div>
            </Card>

            <Card>
              <h3 className="section-title text-base mb-5">Job Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Employee ID" placeholder="e.g. EMP-0021" required error={errors.employeeId?.message} {...register('employeeId')} />
                <Select label="Designation" placeholder="Select designation" options={DESIGNATION_OPTIONS} required error={errors.designation?.message} {...register('designation')} />
                <Select label="Department" placeholder="Select department" options={DEPARTMENT_OPTIONS} required error={errors.department?.message} {...register('department')} />
                <Input label="Joining Date" type="date" required error={errors.joiningDate?.message} {...register('joiningDate')} />
                <Input label="Monthly Salary (₹)" type="number" placeholder="e.g. 15000" required min="1000" error={errors.salary?.message} {...register('salary')} />
              </div>
            </Card>
          </div>

          <div className="space-y-5">
            <Card>
              <h3 className="section-title text-base mb-4">Photo</h3>
              <div className="border-2 border-dashed border-erp-border dark:border-erp-dark-border rounded-xl p-6 text-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Staff" className="w-20 h-20 rounded-full object-cover mx-auto mb-3" />
                ) : (
                  <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <HiOutlineArrowLeft className="w-8 h-8 text-primary rotate-90" />
                  </div>
                )}
                <p className="text-sm text-erp-muted dark:text-erp-dark-text mb-2">
                  {uploadingPhoto ? 'Uploading...' : 'Upload staff photo'}
                </p>
                <label className="btn-outline btn btn-sm cursor-pointer inline-block">
                  Choose File
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} disabled={uploadingPhoto} />
                </label>
                {!isEdit && avatarUrl && (
                  <p className="text-caption text-erp-muted mt-2">Photo will be attached once you save the staff member.</p>
                )}
              </div>
            </Card>

            <Card>
              <h3 className="section-title text-base mb-4">Status</h3>
              <Select label="Employment Status" options={STATUS_OPTIONS} {...register('status')} />
            </Card>

            <Card>
              <h3 className="section-title text-base mb-4">Actions</h3>
              <div className="space-y-2.5">
                <Button type="submit" variant="primary" loading={isSubmitting} className="w-full">
                  {isEdit ? 'Update Staff Member' : 'Save Staff Member'}
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={handleReset} disabled={isSubmitting}>
                  Reset Form
                </Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => navigate('/staff')} disabled={isSubmitting}>
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
