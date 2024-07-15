import React, { useRef, useState } from 'react';
import { SafeAreaView, View, TouchableOpacity } from 'react-native';
import { MapView } from '@tastien/react-native-amap3d';
import { useExpandPunter, useLocation, useBatchUpdatePoint, usePoints } from './hooks';
import { MapPoint, Back, BatchEditPointSheet } from './components';
import { ExpandGroupViewToast } from './components/ExpandGroupViewToast';
import { GroupManage } from './constant/label';

export const MapPunterBatchEditScreen = () => {
  const mapViewRef = useRef<MapView>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const { navigation } = useExpandPunter();
  const { handleUpdate } = useBatchUpdatePoint();
  const { points } = usePoints();
  const { location } = useLocation();

  return (
    <SafeAreaView>
      <View className="absolute top-6 left-2 z-10">
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Back />
        </TouchableOpacity>
      </View>
      {loading && <ExpandGroupViewToast tip={GroupManage.modifingTip} type="loading" />}
      <View style={{ position: 'relative' }} className="w-full h-full">
        <MapPoint
          mapViewRef={mapViewRef}
          positionList={points}
          zoom={true}
          scroll={true}
          location={location}
          polygonPoints={[]}
          onMarkerPress={() => {}}
          onCameraIdle={() => {}}
        />
        <BatchEditPointSheet
          onClose={() => {
            navigation.goBack();
          }}
          batchUpdatePoint={() => {
            setLoading(true);
            handleUpdate({
              success: () => {
                setLoading(false);
                setLoaded(true);
                setTimeout(() => {
                  navigation.goBack();
                  setLoaded(false);
                }, 2000);
              },
              fail: () => {
                setLoading(false);
              },
            });
          }}
        />
        {loaded && <ExpandGroupViewToast tip={GroupManage.modifySuccessTip} type="success" />}
      </View>
    </SafeAreaView>
  );
};
