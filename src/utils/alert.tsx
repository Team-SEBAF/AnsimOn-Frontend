import { toast } from 'react-toastify';
import { AlertCard } from '@/components/AlertCard';

interface AlertOptions {
  title: string;
  description?: string;
  duration?: number;
}

export const showAlert = {
  error: ({ title, description, duration = 5000 }: AlertOptions) =>
    toast(
      ({ closeToast }) => (
        <AlertCard variant="error" title={title} description={description} onClose={closeToast} />
      ),
      {
        autoClose: duration,
        closeButton: false,
        hideProgressBar: true,
        style: { background: 'transparent', boxShadow: 'none', padding: 0 },
      },
    ),

  success: ({ title, description, duration = 5000 }: AlertOptions) =>
    toast(
      ({ closeToast }) => (
        <AlertCard variant="success" title={title} description={description} onClose={closeToast} />
      ),
      {
        autoClose: duration,
        closeButton: false,
        hideProgressBar: true,
        style: { background: 'transparent', boxShadow: 'none', padding: 0 },
      },
    ),
};
