import * as React from 'react';
import { MapView } from '@tastien/react-native-amap3d';
import { MarkerLocationDetail } from './MarkerLocationDetail';
import { useMemo, useRef } from 'react';
import { usePoints, useTask } from '../map/hooks';
import { View } from 'tamagui';
import { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';
import { Map } from '@/src/components';
// import { useLoader } from '@/src/hooks';

type MapPointDetailScreenProps = {
  MapPointDetail: { entry?: 'EVALUATION' | 'DETAIL'; latitude: number; longitude: number };
};

export const MapPointDetailScreen = ({ route }: { route: RouteProp<MapPointDetailScreenProps, 'MapPointDetail'> }) => {
  const { entry = 'DETAIL', latitude, longitude } = route.params;
  const mapViewRef = useRef<MapView>(null);
  const { points } = usePoints();
  const { list: taskList } = useTask();

  const positionList = useMemo(() => {
    return [...points, ...taskList];
  }, [points, taskList]);
  return (
    <SafeAreaView>
      <View style={{ position: 'relative' }}>
        <View className="w-full h-full">
          <View className="w-full h-3/6">
            <Map positionList={positionList} mapViewRef={mapViewRef} location={{ latitude, longitude }} />
          </View>

          <MarkerLocationDetail entry={entry} />
        </View>
      </View>
    </SafeAreaView>
  );
};
