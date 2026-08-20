import Swal from 'sweetalert2';

const swalBase = Swal.mixin({
  customClass: {
    popup: 'rounded-dialog shadow-modal font-sans text-sm',
    confirmButton: 'btn-primary px-5 py-2 rounded-btn text-sm',
    cancelButton: 'btn-outline px-5 py-2 rounded-btn text-sm ml-2',
    title: 'text-h4 font-heading text-erp-heading',
  },
  buttonsStyling: false,
});

export const dialog = {
  confirm: ({ title, text, confirmText = 'Confirm', cancelText = 'Cancel', icon = 'question' } = {}) =>
    swalBase.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
    }),

  delete: ({ title = 'Delete Record?', text = 'This action cannot be undone.' } = {}) =>
    swalBase.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'btn-danger px-5 py-2 rounded-btn text-sm',
        cancelButton: 'btn-outline px-5 py-2 rounded-btn text-sm ml-2',
        popup: 'rounded-dialog shadow-modal font-sans text-sm',
      },
      buttonsStyling: false,
    }),

  logout: () =>
    swalBase.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Stay',
    }),

  success: ({ title = 'Success!', text = '' } = {}) =>
    swalBase.fire({ title, text, icon: 'success', timer: 2000, showConfirmButton: false }),

  error: ({ title = 'Error!', text = '' } = {}) =>
    swalBase.fire({ title, text, icon: 'error' }),

  warning: ({ title = 'Warning!', text = '' } = {}) =>
    swalBase.fire({ title, text, icon: 'warning' }),
};
