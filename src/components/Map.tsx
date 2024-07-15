import * as React from 'react';
import { InteractionManager } from 'react-native';
import { LatLng, MapType, MapView, Marker } from '@tastien/react-native-amap3d';
import { markerLocationBgIcons, markerLocationIconUrls } from '../screens/map/constant/constants';
import { memo, useEffect, useRef, useState } from 'react';
import { useShowConfig } from '../screens/map/hooks';
import { useLoader } from '@/src/hooks';

export const Map = memo(
  ({
    mapViewRef,
    positionList,
    location,
  }: {
    positionList: any[];
    mapViewRef: React.RefObject<MapView>;
    location: LatLng;
  }) => {
    const [markers, setMarkers] = useState<any>([]);
    const {
      config: { isShowName, mapType },
    } = useShowConfig();
    const MarkerRef = useRef<any>(null);

    const { setVisible } = useLoader();

    useEffect(() => {
      setMarkers([]);
    }, [positionList]);

    useEffect(() => {
      if (positionList?.length > 0) {
        setVisible(true);
        InteractionManager.runAfterInteractions(() => {
          requestAnimationFrame(() => {
            const filterData = positionList.filter((item) => {
              const distance = getDistance(
                { latitude: location.latitude, longitude: location.longitude },
                { latitude: item?.latitude, longitude: item?.longitude },
              );
              return distance <= 3000;
            });
            setMarkers(filterData);
          });
        });
        setVisible(false);
      }
    }, [location.latitude, location.longitude, positionList, setVisible]);

    useEffect(() => {
      if (isShowName || !isShowName) {
        MarkerRef.current?.update();
      }
    }, [isShowName]);

    return (
      <MapView
        ref={mapViewRef}
        rotateGesturesEnabled={false}
        compassEnabled={false}
        mapType={mapType === 1 ? MapType.Standard : MapType.Satellite}
        tiltGesturesEnabled={false}
        zoomControlsEnabled={false}
        initialCameraPosition={{ zoom: 16.5, target: location }}
      >
        {markers?.map((info: any) => {
          const imageUrl = info?.icon;
          const iconUrl = markerLocationIconUrls[info?.color ?? 1];
          const bgImgUrl = markerLocationBgIcons[info?.color ?? 1];

          const isCurrent = info.latitude === location.latitude && info.longitude === location.longitude;
          const isTask = info?.type === 'task';
          if (isTask) {
            return (
              <Marker
                ref={MarkerRef}
                icon={{ uri: imageUrl, width: 20, height: 20, cache: 'force-cache' }}
                key={info.id}
                position={{
                  latitude: info.latitude,
                  longitude: info.longitude,
                }}
                name={isShowName ? info?.name : null}
              />
            );
          }
          return (
            <Marker
              ref={MarkerRef}
              backgroundIcon={imageUrl ? { uri: bgImgUrl } : null}
              icon={
                imageUrl
                  ? { uri: imageUrl, width: isCurrent ? 30 : 20, height: isCurrent ? 30 : 20, cache: 'force-cache' }
                  : { uri: iconUrl, width: isCurrent ? 40 : 30, height: isCurrent ? 45 : 35, cache: 'force-cache' }
              }
              key={info.id}
              position={{
                latitude: info.latitude,
                longitude: info.longitude,
              }}
              onPress={() => {
                // onMarkerPress(info);
              }}
              name={isShowName ? info?.name : null}
            />
          );
        })}
      </MapView>
    );
  },
);

const getDistance = (location1: LatLng, location2: LatLng) => {
  const toRadian = (degree: number) => {
    return (degree * Math.PI) / 180;
  };

  const R = 6371;
  const dLat = toRadian(location2.latitude - location1.latitude);
  const dLon = toRadian(location2.longitude - location1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadian(location1.latitude)) *
      Math.cos(toRadian(location2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance * 1000;
};
