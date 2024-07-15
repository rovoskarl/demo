import { Toast, ToastToken } from '@/src/interfaces/notifications';
import { useDependency } from '@/src/ioc';

export const useToast = () => {
  const toast = useDependency<Toast>(ToastToken);
  return {
    toast,
  };
};
