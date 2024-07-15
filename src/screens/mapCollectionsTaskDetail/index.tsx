import * as React from 'react';
import { MapView } from '@tastien/react-native-amap3d';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useMapInfo, useMapList, usePoints, useTask } from '../map/hooks';
import { View } from 'tamagui';
import { RouteProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';
import { Map } from '@/src/components';
import { useCollectionsTaskDetail } from './hooks';
import { CollectionsTaskDetail } from './component';
import { useDependency } from '@/src/ioc';
import { Toast, ToastToken } from '@/src/interfaces/notifications';
import { ScreenNavigationProp } from '@/src/navigation';
import { taskIcon } from '../map/constant/constants';
import { CollectedTaskStatusEnum } from './types';

type MapCollectionsTaskDetailScreenProps = {
  MapCollectionsTaskDetail: { taskId: number };
};

export const MapCollectionsTaskDetailScreen = ({
  route,
}: {
  route: RouteProp<MapCollectionsTaskDetailScreenProps, 'MapCollectionsTaskDetail'>;
}) => {
  const { taskId } = route.params;
  const { list: taskList } = useTask();
  const mapViewRef = useRef<MapView>(null);
  const { points } = usePoints();
  const toast = useDependency<Toast>(ToastToken);
  const { updateMapInfo } = useMapInfo();
  const { mapList } = useMapList();
  const { data, mapId, run, setTaskId } = useCollectionsTaskDetail();
  const navigation = useNavigation<ScreenNavigationProp>();

  useFocusEffect(
    useCallback(() => {
      setTaskId(taskId);
      run();
    }, [run, setTaskId, taskId]),
  );

  const setMapInfo = useCallback(async () => {
    if (!mapId || !mapList?.length) {
      return;
    }
    const mapInfo = mapList.find((item: any) => +item.id === +mapId);
    if (!mapInfo) {
      toast.show('任务所在地图信息获取错误，请重试');
      navigation.canGoBack() && navigation.goBack();
      return;
    }
    updateMapInfo(mapInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapId, JSON.stringify(mapList), updateMapInfo, toast, navigation]);

  useEffect(() => {
    setMapInfo();
  }, [setMapInfo]);

  const positionList = useMemo(() => {
    const pointlist = [...points, ...taskList];
    if (data?.statusCode === CollectedTaskStatusEnum.COLLECTED) {
      const task = { ...data, name: data?.taskName, type: 'task', icon: taskIcon[1] };
      pointlist.push(task);
    }
    return pointlist;
  }, [data, points, taskList]);

  return (
    data && (
      <SafeAreaView>
        <View style={{ position: 'relative' }}>
          <View className="w-full h-full">
            <View className="w-full h-3/6">
              <Map
                positionList={positionList}
                mapViewRef={mapViewRef}
                location={{ latitude: data.latitude, longitude: data.longitude }}
              />
            </View>
          </View>

          <CollectionsTaskDetail />
        </View>
      </SafeAreaView>
    )
  );
};
