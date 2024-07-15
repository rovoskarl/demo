import * as React from 'react';
import { View } from 'react-native';
import { MapView } from '@tastien/react-native-amap3d';

const ExpandPunter = ({ location, mapViewRef }: { location: any; mapViewRef: React.RefObject<MapView> }) => {
  console.log('ExpandPunter-component');
  return (
    <View className="w-full h-full">
      <MapView
        ref={mapViewRef}
        rotateGesturesEnabled={false}
        compassEnabled={false}
        tiltGesturesEnabled={false}
        zoomControlsEnabled={false}
        initialCameraPosition={{ zoom: 10, target: location }}
      />
    </View>
  );
};

export const ExpandPunterMap = React.memo(ExpandPunter);
