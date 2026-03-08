import { toast } from 'react-toastify';
import { AlertCard } from '@/components/AlertCard';

interface AlertOptions {
  title: string;
  description?: string;
}

export const showAlert = {
  error: ({ title, description }: AlertOptions) =>
    toast(({ closeToast }) => (
      <AlertCard variant="error" title={title} description={description} onClose={closeToast} />
    )),

  success: ({ title, description }: AlertOptions) =>
    toast(({ closeToast }) => (
      <AlertCard variant="success" title={title} description={description} onClose={closeToast} />
    )),
};
