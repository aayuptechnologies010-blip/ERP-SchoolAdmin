import { toast } from 'react-toastify';

const baseOptions = {
  position: 'top-right',
  autoClose: 3500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const notify = {
  success: (message) => toast.success(message, baseOptions),
  error: (message) => toast.error(message, baseOptions),
  info: (message) => toast.info(message, baseOptions),
  warning: (message) => toast.warning(message, baseOptions),
  promise: (promise, { pending, success, error }) =>
    toast.promise(promise, { pending, success, error }, baseOptions),
};
