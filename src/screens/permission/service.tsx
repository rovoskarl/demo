import { singleton } from 'tsyringe';
import {
  NotificationOption,
  NotificationsResponse,
  PERMISSIONS,
  Permission,
  check,
  checkMultiple,
  openSettings,
  request,
  requestNotifications,
  requestMultiple,
} from 'react-native-permissions';
import { Platform } from 'react-native';

const PLATFORM_PERMISSIONS = Platform.select<typeof PERMISSIONS.ANDROID | typeof PERMISSIONS.IOS>({
  android: PERMISSIONS.ANDROID,
  ios: PERMISSIONS.IOS,
});

// export const PLATFORM_INCLUDE_PERMISSIONS = Platform.select({
//   android: ['ACCESS_FINE_LOCATION', 'RECORD_AUDIO', 'WRITE_EXTERNAL_STORAGE', 'MODIFY_AUDIO_SETTINGS'],
//   ios: ['PHOTO_LIBRARY', 'LOCATION_WHEN_IN_USE', 'MICROPHONE', 'CAMERA'],
// });

export const PLATFORM_INCLUDE_PERMISSIONS = Platform.select({
  android: ['RECORD_AUDIO'],
  ios: ['MICROPHONE'],
});

export const PLATFORM_INCLUDE_VALUES = Platform.select<{ [key: string]: string }>({
  android: {
    ACCESS_FINE_LOCATION: '位置',
    RECORD_AUDIO: '麦克风',
    WRITE_EXTERNAL_STORAGE: '存储',
    MODIFY_AUDIO_SETTINGS: '麦克风设置',
  },
  ios: {
    PHOTO_LIBRARY: '相册',
    LOCATION_WHEN_IN_USE: '位置',
    MICROPHONE: '麦克风',
    CAMERA: '相机',
  },
});

type PermissionResult = {
  name: any;
  value: Permission;
};

@singleton()
export class PermissionService {
  constructor() {}

  permissionValues = async (permissions: string[]): Promise<PermissionResult[]> => {
    const permissionList = Platform.select({
      android: [PERMISSIONS.ANDROID.RECORD_AUDIO],
      ios: [PERMISSIONS.IOS.MICROPHONE],
    });
    console.log('permissionList', permissionList);
    await this.requestMultiple(permissionList ?? []);
    const PERMISSIONS_VALUES: Permission[] = Object.values(PLATFORM_PERMISSIONS ?? {});
    const list = PERMISSIONS_VALUES.map((item) => {
      const parts = item.split('.');
      const name = parts[parts.length - 1];
      return {
        name: name,
        value: item,
      };
    });
    return Promise.resolve(list.filter((item) => permissions?.includes(item.name)));
  };

  /** 请求通知权限 */
  requestNotificationPermission = async (): Promise<NotificationsResponse> => {
    const options: NotificationOption[] = ['alert', 'badge', 'sound'];
    return await requestNotifications(options);
  };

  /** 检查多个权限是否授权 */
  checkMultiple = async (permissions: Permission[]) => {
    return await checkMultiple(permissions);
  };

  /** 启用权限 */
  requestPermission = async (permission: any) => {
    return await request(permission);
  };

  requestMultiple = async (permissions: Permission[]) => {
    return await requestMultiple(permissions);
  };

  /** 单个权限检测 */
  checkAndRequestPermission = async (permission: any) => {
    return await check(permission);
  };

  /** 打开APP设置 */
  openAppSettings = async () => {
    return await openSettings();
  };
}
