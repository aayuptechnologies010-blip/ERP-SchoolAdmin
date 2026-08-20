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
import { GENDER_OPTIONS, CLASS_OPTIONS, SECTION_OPTIONS, APP_NAME } from '../../constants';
import api from '../../api/api';

const baseShape = {
  name: yup.string().required('Student name is required').min(3, 'Must be at least 3 characters'),
  email: yup.string().email('Invalid email').required('Email is required (used for student login)'),
  phone: yup.string().required('Phone number is required').matches(/^[6-9]\d{9}$/, 'Enter valid 10-digit phone'),
  rollNo: yup.string().required('Roll number is required'),
  dob: yup.string().required('Date of birth is required'),
  gender: yup.string().required('Gender is required'),
  class: yup.string().required('Class is required'),
  section: yup.string().required('Section is required'),
  fatherName: yup.string().required("Father's name is required"),
  motherName: yup.string(),
  address: yup.string().required('Address is required'),
  admissionDate: yup.string().required('Admission date is required'),
};

const addSchema = yup.object({
  ...baseShape,
  password: yup.string().required('A login password is required for the student').min(6, 'At least 6 characters'),
});
const editSchema = yup.object(baseShape);

const classValueToLabel = (value) => CLASS_OPTIONS.find((c) => c.value === value)?.label || value;
const classLabelToValue = (label) => CLASS_OPTIONS.find((c) => c.label === label)?.value || label;

export default function StudentFormPage({ isEdit = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loadingStudent, setLoadingStudent] = useState(isEdit);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(isEdit ? editSchema : addSchema),
    defaultValues: { admissionDate: new Date().toISOString().split('T')[0] },
  });

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notify.error('Please select an image file');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      notify.error('Photo must be smaller than 5MB');
      e.target.value = '';
      return;
    }

    setUploadingPhoto(true);

    try {
      // Resize/compress in the browser and store the final avatar directly
      // on the student's User document. This avoids Render's ephemeral local
      // filesystem and makes the photo available after redeploy/restart.
      const avatar = await new Promise((resolve, reject) => {
        const image = new Image();
        const reader = new FileReader();

        reader.onload = () => {
          image.onload = () => {
            const maxSize = 512;
            const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(image.width * scale));
            canvas.height = Math.max(1, Math.round(image.height * scale));

            const context = canvas.getContext('2d');
            if (!context) return reject(new Error('Could not process image'));

            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.82));
          };
          image.onerror = () => reject(new Error('Invalid image file'));
          image.src = reader.result;
        };

        reader.onerror = () => reject(new Error('Could not read image'));
        reader.readAsDataURL(file);
      });

      setAvatarUrl(avatar);

      if (isEdit && id) {
        await api.put(`/students/${id}/avatar`, { avatar });
      }

      notify.success(isEdit ? 'Photo updated successfully' : 'Photo selected successfully');
    } catch (err) {
      notify.error(err.message || 'Photo upload failed');
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

  useEffect(() => {
    if (!isEdit || !id) return;
    (async () => {
      try {
        const { data } = await api.get(`/students/${id}`);
        const s = data.data;
        reset({
          name: s.user?.name || '',
          email: s.user?.email || '',
          phone: s.user?.phone || '',
          rollNo: s.rollNo || '',
          dob: s.dob ? s.dob.split('T')[0] : '',
          gender: s.gender ? s.gender.toLowerCase() : '',
          class: classLabelToValue(s.class),
          section: s.section || '',
          fatherName: s.fatherName || '',
          motherName: s.motherName || '',
          address: s.address || '',
          admissionDate: s.admissionDate ? s.admissionDate.split('T')[0] : '',
        });
        setAvatarUrl(s.user?.avatar || '');
      } catch (err) {
        notify.error(err.message);
        navigate('/students');
      } finally {
        setLoadingStudent(false);
      }
    })();
  }, [isEdit, id, reset, navigate]);

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      rollNo: data.rollNo,
      dob: data.dob,
      gender: data.gender ? data.gender.charAt(0).toUpperCase() + data.gender.slice(1) : '',
      class: classValueToLabel(data.class),
      section: data.section,
      fatherName: data.fatherName,
      motherName: data.motherName,
      address: data.address,
      admissionDate: data.admissionDate,
    };
    if (!isEdit) {
      payload.password = data.password;
      if (avatarUrl) payload.avatar = avatarUrl;
    }

    try {
      if (isEdit) {
        // Student model fields only - name/email/phone live on the User
        // record and aren't editable from this form yet.
        const { name, email, phone, password, ...studentFields } = payload;
        await api.put(`/students/${id}`, studentFields);
        notify.success('Student updated successfully!');
      } else {
        await api.post('/students', payload);
        notify.success('Student added successfully!');
      }
      navigate('/students');
    } catch (err) {
      notify.error(err.message);
    }
  };

  const handleReset = async () => {
    const result = await dialog.confirm({
      title: 'Reset Form?',
      text: 'All entered data will be cleared.',
      confirmText: 'Yes, Reset',
      icon: 'warning',
    });
    if (result.isConfirmed) reset();
  };

  if (loadingStudent) {
    return <div className="py-20 text-center text-erp-muted">Loading student...</div>;
  }

  return (
    <>
      <Helmet><title>{isEdit ? 'Edit Student' : 'Add Student'} — {APP_NAME}</title></Helmet>
      <PageHeader
        title={isEdit ? 'Edit Student' : 'Add New Student'}
        subtitle={isEdit ? 'Update student information' : 'Fill in the details to enroll a new student'}
        actions={
          <Button variant="outline" icon={HiOutlineArrowLeft} onClick={() => navigate('/students')}>
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
                  <Input label="Full Name" placeholder="Enter student full name" required error={errors.name?.message} {...register('name')} />
                </div>
                <Input label="Date of Birth" type="date" required error={errors.dob?.message} {...register('dob')} />
                <Select label="Gender" placeholder="Select gender" options={GENDER_OPTIONS} required error={errors.gender?.message} {...register('gender')} />
                <Input label="Phone Number" type="tel" placeholder="10-digit mobile number" required error={errors.phone?.message} {...register('phone')} />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="student@example.com"
                  required
                  disabled={isEdit}
                  hint={isEdit ? 'Login email cannot be changed here' : 'This becomes the student\'s login email'}
                  error={errors.email?.message}
                  {...register('email')}
                />
                {!isEdit && (
                  <Input
                    label="Login Password"
                    type="password"
                    placeholder="Set an initial password"
                    required
                    hint="Student will use this to log into the Student Panel"
                    error={errors.password?.message}
                    {...register('password')}
                  />
                )}
              </div>
            </Card>

            <Card>
              <h3 className="section-title text-base mb-5">Academic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input label="Roll Number" placeholder="e.g. CL8A001" required error={errors.rollNo?.message} {...register('rollNo')} />
                <Select label="Class" placeholder="Select class" options={CLASS_OPTIONS} required error={errors.class?.message} {...register('class')} />
                <Select label="Section" placeholder="Select section" options={SECTION_OPTIONS} required error={errors.section?.message} {...register('section')} />
                <Input label="Admission Date" type="date" required error={errors.admissionDate?.message} {...register('admissionDate')} />
              </div>
            </Card>

            <Card>
              <h3 className="section-title text-base mb-5">Parent / Guardian Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Father's Name" placeholder="Father's full name" required error={errors.fatherName?.message} {...register('fatherName')} />
                <Input label="Mother's Name" placeholder="Mother's full name" error={errors.motherName?.message} {...register('motherName')} />
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
                  <img src={avatarUrl} alt="Student" className="w-20 h-20 rounded-full object-cover mx-auto mb-3" />
                ) : (
                  <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <HiOutlineArrowLeft className="w-8 h-8 text-primary rotate-90" />
                  </div>
                )}
                <p className="text-sm text-erp-muted dark:text-erp-dark-text mb-2">
                  {uploadingPhoto ? 'Uploading...' : 'Upload student photo'}
                </p>
                <label className="btn-outline btn btn-sm cursor-pointer inline-block">
                  Choose File
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} disabled={uploadingPhoto} />
                </label>
              </div>
            </Card>

            <Card>
              <h3 className="section-title text-base mb-4">Actions</h3>
              <div className="space-y-3">
                <Button type="submit" variant="primary" loading={isSubmitting} className="w-full">
                  {isEdit ? 'Update Student' : 'Save Student'}
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={handleReset}>
                  Reset Form
                </Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => navigate('/students')}>
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
