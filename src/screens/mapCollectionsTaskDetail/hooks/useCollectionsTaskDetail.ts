import { useLoader } from '@/src/hooks';
import { create } from 'zustand';
import { useService } from './useService';
import { useService as useMapService } from '@/src/screens/map/hooks/useService';
import { TCollectedTaskDetail } from '../types';
import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useDependency } from '@/src/ioc';
import { Toast, ToastToken } from '@/src/interfaces/notifications';
import { ScreenNavigationProp } from '@/src/navigation';
import { usePrevFieldsFormValues } from '../../map/hooks';
import { positionDetailToFormValue } from '../../map/components';

type IProps = {
  data?: TCollectedTaskDetail;
  taskId?: number;
  mapId?: number;
  submitPinMapInfo?: any;
  setData: (data?: TCollectedTaskDetail) => void;
  setTaskId: (taskId?: number) => void;
  setMapId: (mapId?: number) => void;
  setSubmitPinMapInfo: (submitPinMapInfo?: any) => void;
};

export const useCollectionsTaskDetailStore = create<IProps>((set) => ({
  data: undefined,
  taskId: undefined,
  mapId: undefined,
  submitPinMapInfo: undefined,
  setTaskId: (taskId) => {
    set({ taskId });
  },
  setData: (data) => {
    set({ data });
  },
  setMapId: (mapId) => {
    set({ mapId });
  },
  setSubmitPinMapInfo: (submitPinMapInfo) => {
    set({ submitPinMapInfo });
  },
}));

export const useCollectionsTaskDetail = () => {
  const { getCollectionsTaskDetail } = useService();

  const { getPositionDetail, getMapIdByAdCode } = useMapService();
  const { data, setData, taskId, mapId, submitPinMapInfo, setTaskId, setSubmitPinMapInfo, setMapId } =
    useCollectionsTaskDetailStore();
  const { setVisible } = useLoader();
  const { setPrevValues, cleanPrevValues } = usePrevFieldsFormValues();
  const toast = useDependency<Toast>(ToastToken);
  const navigation = useNavigation<ScreenNavigationProp>();

  const [storageFieldFormValueCurrentTask, setStorageFieldFormValueCurrentTask] = useState();

  const run = useCallback(async () => {
    setVisible(true);
    if (taskId) {
      try {
        const collectionsTaskDetail = (await getCollectionsTaskDetail({ taskId: taskId })) as TCollectedTaskDetail;
        setData(collectionsTaskDetail as TCollectedTaskDetail);
        const formValues = positionDetailToFormValue({ fieldValues: collectionsTaskDetail.extraFields });
        setPrevValues(formValues);
        if (collectionsTaskDetail?.mapPositionId) {
          const pinMapInfo = await getPositionDetail(collectionsTaskDetail?.mapPositionId);
          setSubmitPinMapInfo(pinMapInfo);
          setMapId(pinMapInfo?.mapId);
        } else {
          const mId = await getMapIdByAdCode(collectionsTaskDetail?.cityCode);
          if (!mId) {
            toast.show('任务所在地图信息获取错误，请重试');
            navigation.canGoBack() && navigation.goBack();
          }
          setMapId(mId);
        }
      } catch (error) {
      } finally {
        setVisible(false);
      }
    }
  }, [
    getCollectionsTaskDetail,
    getMapIdByAdCode,
    getPositionDetail,
    navigation,
    setData,
    setMapId,
    setPrevValues,
    setSubmitPinMapInfo,
    setVisible,
    taskId,
    toast,
  ]);

  const clear = useCallback(() => {
    setData(undefined);
    setTaskId(undefined);
    setMapId(undefined);
    setSubmitPinMapInfo(undefined);
    cleanPrevValues();
  }, [cleanPrevValues, setData, setMapId, setSubmitPinMapInfo, setTaskId]);

  const getStorageFieldFormValue = useCallback((): Promise<Record<string, any>> => {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem('collectionTaskFieldFormValue')
        .then((dataStr) => {
          if (dataStr) {
            const parsedData = JSON.parse(dataStr);
            resolve(parsedData);
          }
          resolve({});
        })
        .catch((err) => {
          reject(err);
        });
    });
  }, []);

  const getStorageFieldFormValueCurrentTask = useCallback(async () => {
    if (taskId) {
      const allValues = await getStorageFieldFormValue();
      setStorageFieldFormValueCurrentTask(allValues[taskId]);
    }
  }, [getStorageFieldFormValue, taskId]);

  const setStorageFieldFormValue = useCallback(
    async (value: any) => {
      if (taskId) {
        const prevValue = await getStorageFieldFormValue();
        AsyncStorage.setItem('collectionTaskFieldFormValue', JSON.stringify({ ...(prevValue || {}), [taskId]: value }));
      }
    },
    [getStorageFieldFormValue, taskId],
  );

  const clearStorageFieldFormValueCurrentTask = useCallback(async () => {
    if (taskId) {
      const prevValue = await getStorageFieldFormValue();
      delete prevValue[taskId];
      AsyncStorage.setItem('collectionTaskFieldFormValue', JSON.stringify(prevValue));
    }
  }, [getStorageFieldFormValue, taskId]);

  return {
    data,
    mapId,
    submitPinMapInfo,
    taskId,
    storageFieldFormValueCurrentTask,
    run,
    clear,
    setTaskId,
    getStorageFieldFormValueCurrentTask,
    setStorageFieldFormValue,
    clearStorageFieldFormValueCurrentTask,
  };
};
