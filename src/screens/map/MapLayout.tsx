import * as React from 'react';
import { MapView } from '@tastien/react-native-amap3d';
import { AdministrativeMap, Map } from './components';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, usePoints, usePosition, useRenderType, useShowConfig } from './hooks';
import { View } from 'tamagui';

export const MapLayout = ({ children }: any) => {
  const { setPositionInfo } = usePosition();
  const mapViewRef = useRef<MapView>(null);
  const { points } = usePoints();
  const { location, setLocation } = useLocation();
  const {
    config: { isShowAdministrative },
  } = useShowConfig();
  const [key, setKey] = useState(0);
  const { type, update: updateType } = useRenderType();

  useEffect(() => {
    if (points?.[0] && type === 'home') {
      const target: any = points?.[0];
      mapViewRef.current?.moveCamera(
        {
          zoom: 10,
          target: { latitude: target.latitude, longitude: target.longitude },
        },
        1000,
      );
      setLocation({ latitude: target?.latitude, longitude: target?.longitude });
    }
  }, [points, setLocation, type]);

  const className = useMemo(() => {
    if (type === 'home') {
      return 'w-full h-full';
    }
    if (type === 'markerLocation') {
      return 'w-full h-3/6';
    }
    if (type === 'nearPosition') {
      return 'w-full h-3/6';
    }
    if (type === 'list') {
      return 'w-full h-3/6';
    }
    if (type === 'markerDetail') {
      return 'w-full h-3/5';
    }
  }, [type]);

  return (
    <View style={{ position: 'relative' }}>
      <View className="w-full h-full">
        <View className={className}>
          {isShowAdministrative ? (
            <AdministrativeMap key={key} location={location} positionList={points} />
          ) : (
            <Map
              positionList={points}
              mapViewRef={mapViewRef}
              onMarkerPress={(detail: any) => {
                setPositionInfo(detail);
                setLocation({ latitude: detail?.latitude, longitude: detail?.longitude });
                mapViewRef.current?.moveCamera(
                  {
                    zoom: 18,
                    target: { latitude: detail?.latitude, longitude: detail?.longitude },
                  },
                  1000,
                );
                updateType('markerDetail');
              }}
            />
          )}
        </View>

        {children}
      </View>
    </View>
  );
};
