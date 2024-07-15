import { singleton } from 'tsyringe';
import { Platform, ToastAndroid } from 'react-native';
import { toast, dismissAlert } from '@baronha/ting';
import { TOAST_DURATIONS, Toast, ToastOptions } from '@/types/notifications';

@singleton()
export class RNToast implements Toast {
  show(firstArg: unknown, position = 'top', durationMs = TOAST_DURATIONS.MIDDLE): any {
    if (typeof firstArg === 'string') {
      const placement = position as any;
      if (Platform.OS === 'android') {
        return ToastAndroid.show(firstArg, durationMs);
      }
      return toast({
        position: placement,
        duration: durationMs,
        message: firstArg as string,
        preset: 'none',
        title: '',
        backgroundColor: '#333333',
        titleColor: '#ffffff',
        messageColor: '#ffffff',
        shouldDismissByDrag: false,
      });
    }
    if (typeof firstArg === 'object') {
      const { message, position: placement = 'top', duration = TOAST_DURATIONS.MIDDLE } = firstArg as ToastOptions;
      if (Platform.OS === 'android') {
        return ToastAndroid.show(message, duration);
      }
      return toast({
        title: '',
        message,
        duration,
        preset: 'none',
        position: placement,
        backgroundColor: '#333333',
        titleColor: '#ffffff',
        messageColor: '#ffffff',
        shouldDismissByDrag: false,
      });
    }
  }

  hidden(): void {
    dismissAlert();
  }
}
