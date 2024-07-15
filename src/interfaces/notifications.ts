export const ToastToken = Symbol('ToastToken');

export type ToastPosition = 'top' | 'bottom';

export interface ToastOptions {
  /** 展示的消息 */
  message: string;
  /** 展示的位置 */
  position?: ToastPosition;
  /** 持续时间 单位毫秒 默认3000ms */
  duration?: number;
  /** 是否展示原生Toast */
  type?: string;
}

export const TOAST_DURATIONS = {
  SHORT: 1,
  MIDDLE: 3,
  LONG: 5,
};

/** 轻提示 */
export interface Toast {
  /**
   * 显示轻提示
   * @param message 展示的消息
   * @param position 展示的位置
   * @param durationMs 持续时间 单位毫秒 默认3000ms
   * @param native 是否展示原生Toast
   */
  show(
    message: string,
    position?: ToastPosition,
    durationMs?: number,
    type?: 'success' | 'warning' | 'error' | 'none',
  ): any;
  show(options: ToastOptions): any;
  hidden(id: any): void;
}
