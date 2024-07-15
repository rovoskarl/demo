import * as React from 'react';
import { SafeAreaView, BackHandler, Platform } from 'react-native';
import { FieldsForm } from './components/FieldsForm/FieldsForm';
import { useNavigation } from '@react-navigation/native';
import { ROUTER_FLAG, ScreenNavigationProp } from '@/src/navigation';
import { useEffect, useState } from 'react';
import { ConfirmModal, CustomFieldGroupIdEnum } from './components';
import { GroupManage } from './constant/label';
import { useAddLocation, useIconUrl, useLocation, usePosition, usePositionDetail, useRenderType } from './hooks';
import { useCollectionsTaskDetail } from '../mapCollectionsTaskDetail/hooks';
import { useLoader } from '@/src/hooks';
import { Toast, ToastToken } from '@/src/interfaces/notifications';
import { useDependency } from '@/src/ioc';
import { computeDistance } from '@/src/utils';

export const MapMarkLocationInfoScreen = ({ route }: any) => {
  const isEdit = route.params?.isEdit ?? false;
  const buttonText = route.params?.buttonText;
  const navigation = useNavigation<ScreenNavigationProp>();

  const { positionInfo: markerDetail } = usePosition();
  const { detail, getPositionDetail } = usePositionDetail();
  const toast = useDependency<Toast>(ToastToken);
  const {
    taskId,
    data: taskInfo,
    storageFieldFormValueCurrentTask,
    clear: clearTaskInfo,
    setStorageFieldFormValue,
    getStorageFieldFormValueCurrentTask,
    clearStorageFieldFormValueCurrentTask,
  } = useCollectionsTaskDetail();
  const { addLocation } = useAddLocation();
  const { update } = useRenderType();
  const { setKey } = useIconUrl();
  const { setVisible } = useLoader();
  const { setLocationInfo } = useLocation();
  const onHandleSubmit = async (requestData: Record<string, any>) => {
    if (taskInfo) {
      const distance = computeDistance(
        requestData?.latitude,
        requestData?.longitude,
        taskInfo?.latitude,
        taskInfo?.longitude,
      ).toFixed(3);

      if (!distance || +distance > 0.5) {
        toast.show('钉图与任务地点距离过远');
        setVisible(false);
        return Promise.reject();
      }
    }
    return await addLocation({ taskId, ...requestData })
      .then(() => {
        navigation.reset({
          index: 1,
          routes: [{ name: ROUTER_FLAG.Home }],
        });
        update('home');
        setLocationInfo({});
        setKey([1]);
        clearStorageFieldFormValueCurrentTask();
        clearTaskInfo();
      })
      .finally(() => {
        setVisible(false);
      });
  };

  useEffect(() => {
    getStorageFieldFormValueCurrentTask();
  }, [getStorageFieldFormValueCurrentTask]);

  useEffect(() => {
    if (markerDetail?.id && isEdit) {
      getPositionDetail({ id: markerDetail.id, type: markerDetail?.positionType });
    }
  }, [getPositionDetail, isEdit, markerDetail.id, markerDetail?.positionType]);

  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        if (e.data.action.type === 'POP') {
          e.preventDefault();
          setConfirm(true);
        }
      });

      return unsubscribe;
    }
  }, [navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      setConfirm(true);
      return true;
    });

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView className="relative">
      <FieldsForm
        isEdit={isEdit}
        data={detail}
        storageFieldFormValue={storageFieldFormValueCurrentTask}
        templateId={CustomFieldGroupIdEnum.PinMapCollectionInfo}
        buttonText={buttonText}
        onValueChange={setStorageFieldFormValue}
        onSubmit={onHandleSubmit}
      />
      {confirm ? (
        <ConfirmModal
          mask={true}
          tipContent={GroupManage.returnDinMapCollect}
          cancelHandler={() => {
            setConfirm(false);
          }}
          confirmHandler={() => {
            navigation.goBack();
          }}
        />
      ) : null}
    </SafeAreaView>
  );
};
