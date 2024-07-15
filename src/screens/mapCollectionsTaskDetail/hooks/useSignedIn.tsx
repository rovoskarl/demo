import { Geolocation, init } from 'react-native-amap-geolocation';
import Config from 'react-native-config';
import { BatchOperation } from '../../map/constant/label';
import { Toast, ToastToken } from '@/src/interfaces/notifications';
import { useDependency } from '@/src/ioc';
import { useService } from '.';
import { computeDistance } from '@/src/utils';
import { PermissionsAndroid, Platform } from 'react-native';

type TLngLat = { longitude: number; latitude: number };

const getDistance = async (position: TLngLat): Promise<string> => {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);
  }
  return new Promise((resolve, reject) => {
    init({
      android: Config.APP_TD_AMAP_ANDROID_KEY,
      ios: Config.APP_TD_AMAP_IOS_KEY,
    })
      .then(() => {
        Geolocation.getCurrentPosition(
          ({ coords }) => {
            const distance = computeDistance(
              position?.latitude,
              position?.longitude,
              coords?.latitude,
              coords?.longitude,
            );
            resolve(distance.toFixed(3));
          },
          (error) => {
            reject(error);
          },
        );
      })
      .catch((reason) => {
        reject(reason);
      });
  });
};

export const useSignedIn = () => {
  const toast = useDependency<Toast>(ToastToken);
  const { signInCollectionsTask } = useService();

  const signedIn = async ({ taskId, position }: { taskId: number; position: TLngLat }) => {
    return new Promise(async (resolve, reject) => {
      // 判断是否在范围内
      getDistance(position)
        .then((distance) => {
          if (!distance || +distance > 0.5) {
            toast.show(BatchOperation.signRangeExceeds);
            reject('signRangeExceeds');
          } else {
            signInCollectionsTask({ taskId: taskId })
              .then(() => {
                resolve('签到成功');
              })
              .catch((reason) => {
                reject(reason);
              });
          }
        })
        .catch((error) => {
          if (error?.code === 12) {
            toast.show('定位权限被禁用,请授予应用定位权限');
          }
          reject(error);
        });
    });
  };

  return { signedIn };
};
