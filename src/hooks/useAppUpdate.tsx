import { useEffect, useState } from 'react';
import { Alert, ImageBackground, Linking, Platform, Pressable } from 'react-native';
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
  isFileExists,
  onInstallApp,
} from '@tastien/react-native-update';
import * as Sentry from '@sentry/react-native';
import _updateConfig from '../../update.json';
import { UtilModule } from '@/src/utils';
import Config from 'react-native-config';
import { Button, Dialog, Progress, ScrollView, Sheet, Text, View, XStack } from 'tamagui';
import { CloseCircular } from '../icons';
import { GlobalStore } from '../store';
import { useDependency } from '../ioc';
import { create } from 'zustand';

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

const UpdateModal = ({ open, modalOptions }: { open: boolean; modalOptions: any }) => {
  return (
    <Dialog modal open={open}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="slow"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          zIndex={0}
        />
        <ImageBackground
          source={require('../assets/images/update-modal-bg.png')}
          resizeMode="contain"
          style={{
            height: 369,
            zIndex: 999,
            position: 'relative',
          }}
        >
          <View paddingHorizontal={21} margin={56} paddingBottom={26} position="relative" top={70}>
            <XStack alignItems="center" justifyContent="center">
              <Text fontSize={20} style={{ fontWeight: 600 }}>
                {modalOptions.title}
              </Text>
              {modalOptions.version && (
                <Text
                  fontSize={10}
                  backgroundColor="#FF895F"
                  color={'#ffffff'}
                  paddingHorizontal={3}
                  borderBottomRightRadius={10}
                  borderTopRightRadius={10}
                  borderTopLeftRadius={9}
                  borderBottomLeftRadius={3}
                  marginLeft={3}
                >
                  V{modalOptions.version}
                </Text>
              )}
            </XStack>
            <View style={{ height: 109 }}>
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Text fontSize={14} marginTop={20} numberOfLines={0}>
                  {modalOptions.description}
                </Text>
              </ScrollView>
            </View>

            <Button
              backgroundColor="$primaryLight"
              color="white"
              marginTop={29}
              onPress={async () => {
                if (await isFileExists()) {
                  onInstallApp();
                  return;
                }
                modalOptions.onConfirm();
                modalOptions.onClose();
              }}
            >
              立即体验
            </Button>
            {!modalOptions.force ? (
              <XStack position="absolute" bottom={-60} left={'50%'} transform={[{ translateX: 0 }]}>
                <Pressable onPress={() => modalOptions.onClose()}>
                  <CloseCircular />
                </Pressable>
              </XStack>
            ) : null}
          </View>
        </ImageBackground>
      </Dialog.Portal>
    </Dialog>
  );
};

const ProgressSheet = ({ open, onClose }: { open: boolean; onClose?: () => void }) => {
  const { progress, received, total, force } = useProgress();

  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      dismissOnOverlayPress={false}
      modal={false}
      open={open}
      snapPoints={[260]}
      snapPointsMode="constant"
      animation="medium"
    >
      <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Frame paddingHorizontal={20} paddingTop={30} position="relative">
        <View className="px-3">
          <Text className="font-semibold text-2xl">{progress === 100 ? '下载完成' : '正在下载更新...'}</Text>
          {progress === 100 ? null : (
            <>
              <Progress value={progress} backgroundColor="#DFE0E4" marginTop={60} marginBottom={5}>
                <Progress.Indicator backgroundColor="$primaryLight" animation="bouncy" />
              </Progress>
              <XStack justifyContent="flex-end" marginBottom={35}>
                <Text>
                  {Math.round(received / 1024 / 1024).toFixed(2)}MB/
                  {Math.round(total / 1024 / 1024).toFixed(2)}MB
                </Text>
              </XStack>
            </>
          )}
        </View>
        <View space="$2" padding="$4" position="absolute" bottom={0} left={0} right={0}>
          {!force && (
            <Button width="100%" backgroundColor="$primaryLight" color="white" onPress={() => onClose?.()}>
              {progress === 100 ? '关闭' : '后台执行'}
            </Button>
          )}
          {progress === 100 && (
            <Button
              width="100%"
              backgroundColor="$primaryLight"
              color="white"
              onPress={() => {
                onInstallApp();
                onClose?.();
              }}
            >
              立即安装
            </Button>
          )}
        </View>
      </Sheet.Frame>
    </Sheet>
  );
};

export function useAppUpdate(options: { isAutoUpdate?: boolean } = {}) {
  const [open, setOpen] = useState(false);
  const { setProgress, setReceived, setTotal, setForce } = useProgress();
  const [showSheet, setShowSheet] = useState(false);
  const [modalOptions, setModalOptions] = useState<any>({});
  const global = useDependency(GlobalStore);

  const doHotUpdate = async (info: any, metaInfo: any) => {
    try {
      const hash = await downloadUpdate(info);

      if (!hash) {
        return;
      }

      setOpen(false);

      if (metaInfo?.silent) {
        switchVersionLater(hash);
      } else if (metaInfo?.force) {
        Alert.alert('提示', '下载完毕，是否重启应用?', [
          {
            text: '确定',
            onPress: () => {
              switchVersion(hash);
            },
          },
        ]);
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
              global.setHotUpdateHash(hash);
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

  const doNativeUpdate = (info: any) => {
    if (info.downloadUrl) {
      setOpen(false);
      if (Platform.OS === 'android') {
        downloadAndInstallApk({
          url: info.downloadUrl,
          onDownloadProgress: ({ received, total }: any) => {
            console.log('下载进度:', received, total);
            const progress = Math.round((received / total) * 100);
            setProgress(progress);
            setReceived(received);
            setTotal(total);
            if (progress === 100) {
              UtilModule.hideDownloadProgressBar();
            } else {
              UtilModule.showDownloadProgressBar(Config.APP_NAME, progress);
            }
          },
        });
        setForce(info?.force);
        setShowSheet(true);
      } else {
        Linking.openURL(info.downloadUrl);
      }
    }
  };

  const checkForUpdate = async (isCheckButton: boolean) => {
    if (Platform.OS === 'android' && (await isFileExists())) {
      setShowSheet(true);
      return;
    }

    try {
      if (!updateConfig) {
        return;
      }
      const info: any = await checkUpdate(updateConfig!.appKey);
      if (info?.upToDate && isCheckButton) {
        Alert.alert('提示', '您的应用版本已是最新.', [
          {
            text: '确定',
          },
        ]);
      } else if (info?.update) {
        let metaInfo: any = {};
        try {
          if (info?.metaInfo) {
            metaInfo = JSON.parse(info?.metaInfo);
          }
          if (metaInfo?.silent) {
            if (metaInfo?.downloadUrl) {
              doNativeUpdate(metaInfo);
            } else {
              doHotUpdate(info, metaInfo);
            }
          } else if (info.name) {
            if (global.hotUpdateHash && isCheckButton) {
              Alert.alert('提示', '已下载，是否重启应用?', [
                {
                  text: '确定',
                  onPress: () => {
                    switchVersion(global.hotUpdateHash!);
                  },
                },
                {
                  text: '取消',
                },
              ]);
              return;
            }

            setModalOptions({
              title: '发现新版本',
              description: info.description,
              version: info.name,
              force: metaInfo?.force,
              onConfirm: () => {
                if (metaInfo?.downloadUrl) {
                  doNativeUpdate(metaInfo);
                } else {
                  doHotUpdate(info, metaInfo);
                }
              },
              onClose: () => setOpen(false),
            });
            setOpen(true);
          }
        } catch (e) {
          // 异常处理，忽略或上报？
          console.log(`更新失败:${e}`);
          throw new Error(`更新失败:${e}`);
        }
      }
    } catch (err: any) {
      console.log(`更新检查失败:${err}`);
      throw new Error(`更新检查失败:${err}`);
    }
  };

  const getNoticePermission = async () => {
    try {
      const res = await UtilModule.request('android.permission.POST_NOTIFICATIONS');
      console.log(`获取权限结果:${res}`);
    } catch (error) {
      console.log(`获取权限失败:${error}`);
      throw new Error(`获取权限失败:${error}`);
    }
  };

  useEffect(() => {
    getNoticePermission();

    if (isFirstTime) {
      markSuccess();
    } else if (isRolledBack) {
      Alert.alert('抱歉', '刚刚更新遭遇错误，已为您恢复到更新前版本', [
        {
          text: '好的',
        },
      ]);
    }

    if (options.isAutoUpdate) {
      checkForUpdate(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.isAutoUpdate]);

  const updateNode = (
    <>
      <UpdateModal open={open} modalOptions={modalOptions} />
      {showSheet && <ProgressSheet open={showSheet} onClose={() => setShowSheet(false)} />}
    </>
  );

  return {
    checkUpdate: checkForUpdate,
    updateNode,
    doNativeUpdate,
  };
}

const useProgress = create<{
  progress: number;
  received: number;
  total: number;
  force: boolean;
  setProgress: (num: number) => void;
  setReceived: (num: number) => void;
  setTotal: (num: number) => void;
  setForce: (force: boolean) => void;
}>((set) => ({
  progress: 0,
  received: 0,
  total: 0,
  force: false,

  setProgress: (num: number) => {
    set({
      progress: num,
    });
  },

  setReceived: (num: number) => {
    set({
      received: num,
    });
  },

  setTotal: (num: number) => {
    set({
      total: num,
    });
  },

  setForce: (force: boolean) => {
    set({
      force,
    });
  },
}));
