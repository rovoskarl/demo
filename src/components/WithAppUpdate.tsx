import { ComponentType, useEffect } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import {
  checkUpdate,
  downloadAndInstallApk,
  downloadUpdate,
  onPushyEvents,
  switchVersion,
  switchVersionLater,
  isFirstTime,
  isRolledBack,
  markSuccess,
} from '@tastien/react-native-update';
import * as Sentry from '@sentry/react-native';
import _updateConfig from '../../update.json';
import { UtilModule } from '@/src/utils';
import Config from 'react-native-config';

const updateConfig = Platform.select({
  ios: _updateConfig.ios,
  android: _updateConfig.android,
});

onPushyEvents(({ type, data }) => {
  // 热更成功或报错的事件回调
  // 可上报自有或第三方数据统计服务
  console.log('onPushyEvents', type, data);
  Sentry.addBreadcrumb({
    category: 'version',
    message: type,
    data,
  });
});

export function WithAppUpdate<T extends { checkUpdate: (isTip: boolean) => Promise<void> }>(
  WrappedComponent: ComponentType<T>,
  options: { isFinite?: boolean } = {},
) {
  const checkForUpdate = async (isTip: boolean) => {
    if (__DEV__) {
      return;
    }
    let info: any;
    try {
      if (!updateConfig) {
        return;
      }
      info = await checkUpdate(updateConfig!.appKey);
    } catch (err: any) {
      console.log(`更新检查失败:${err}`);
      throw new Error(`更新检查失败:${err}`);
    }
    if (info.expired) {
      Alert.alert('提示', '您的应用版本已更新，点击确定下载安装新版本', [
        {
          text: '确定',
          onPress: () => {
            if (info.downloadUrl) {
              if (Platform.OS === 'android') {
                downloadAndInstallApk({
                  url: info.downloadUrl,
                  onDownloadProgress: ({ received, total }) => {
                    const progress = Math.round((received / total) * 100);
                    if (progress === 100) {
                      UtilModule.hideDownloadProgressBar();
                    } else {
                      UtilModule.showDownloadProgressBar(Config.APP_NAME, progress);
                    }
                  },
                });
              } else {
                Linking.openURL(info.downloadUrl);
              }
            }
          },
        },
        {
          text: '取消',
        },
      ]);
    } else if (info.upToDate && isTip) {
      Alert.alert('提示', '您的应用版本已是最新.');
    } else if (info.update) {
      let metaInfo: any = {};
      try {
        if (info.metaInfo) {
          metaInfo = JSON.parse(info.metaInfo);
        }
        if (metaInfo?.silent) {
          // 如果热更包携带有 silent 字段，不询问用户，直接执行更新
          doUpdate(info, metaInfo);
        } else if (metaInfo?.force) {
          Alert.alert('提示', '检查到新的版本' + info.name + '，是否下载?\n' + info.description, [
            {
              text: '确定',
              onPress: () => {
                doUpdate(info, metaInfo);
              },
            },
          ]);
        } else {
          Alert.alert('提示', '检查到新的版本' + info.name + '，是否下载?\n' + info.description, [
            {
              text: '确定',
              onPress: () => {
                doUpdate(info, metaInfo);
              },
            },
            { text: '取消' },
          ]);
        }
      } catch (e) {
        // 异常处理，忽略或上报？
        console.log(`更新失败:${e}`);
        throw new Error(`更新失败:${e}`);
      }
    }
  };

  const doUpdate = async (info: any, metaInfo: any) => {
    try {
      const hash = await downloadUpdate(info);
      if (!hash) {
        return;
      }
      if (metaInfo?.silent) {
        switchVersionLater(hash);
      } else {
        Alert.alert('提示', '下载完毕，是否重启应用?', [
          {
            text: '确定',
            onPress: () => {
              switchVersion(hash);
            },
          },
          {
            text: '取消',
            onPress: () => {
              switchVersionLater(hash);
            },
          },
        ]);
      }
    } catch (err: any) {
      console.log(`下载失败:${err}`);
      throw new Error(`下载失败:${err}`);
    }
  };

  // const onPermission = async (info: any) => {
  //   try {
  //     const res = await UtilModule.request('android.permission.REQUEST_INSTALL_PACKAGES');
  //     console.log(`获取权限结果:${res}`);
  //     if (res.GRANTED) {
  //     }
  //   } catch (error) {
  //     console.log(`获取权限失败:${error}`);
  //     throw new Error(`获取权限失败:${error}`);
  //   }
  // };

  function WarpComponent(props: Omit<T, 'checkUpdate'>) {
    useEffect(() => {
      if (isFirstTime) {
        markSuccess();
      } else if (isRolledBack) {
        Alert.alert('抱歉', '刚刚更新遭遇错误，已为您恢复到更新前版本', [
          {
            text: '好的',
          },
        ]);
      }

      if (options.isFinite) {
        checkForUpdate(false);
      }
    }, []);

    return <WrappedComponent {...(props as T)} checkUpdate={checkForUpdate} />;
  }

  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  WarpComponent.displayName = `WithAppUpdate(${displayName})`;

  return WarpComponent;
}
