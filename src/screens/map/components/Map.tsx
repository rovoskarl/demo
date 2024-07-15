import * as React from 'react';
import { Image, InteractionManager, View } from 'react-native';
import { MapType, MapView, Marker } from '@tastien/react-native-amap3d';
import { markerLocationBgIcons, markerLocationIconUrls } from '../constant/constants';
import { memo, useEffect, useRef, useState } from 'react';
import Supercluster, { ClusterProperties } from 'supercluster';
import { useLocation, useRenderType, useShowConfig } from '../hooks';
import { debounce } from 'lodash-es';
import { useLoader } from '@/src/hooks';

const defaultIcon = require('../images/markerLocationIconDefault.png');

const uniqueMarkers = (markers: any[]) => {
  // const uniqueIds = new Set(markers.map((marker) => marker?.properties?.id));
  const filteredMarkers = markers.filter(
    (marker, index, self) => index === self.findIndex((m) => m?.properties?.id === marker?.properties?.id),
  );
  return filteredMarkers;
};

export const Map = memo(
  ({
    mapViewRef,
    onMarkerPress,
    positionList,
  }: {
    mapViewRef: React.RefObject<MapView>;
    onMarkerPress: (info: any) => void;
    positionList: any[];
  }) => {
    const [markers, setMarkers] = useState<any>([]);
    const [locationMarkers, setLocationMarkers] = useState<any>([]);
    const {
      config: { isShowName, mapType },
    } = useShowConfig();
    const clusterRef = useRef<any>(null);
    const MarkerRef = useRef<any>(null);
    const { type } = useRenderType();
    const { location, setLocation } = useLocation();
    const { setVisible } = useLoader();

    useEffect(() => {
      setMarkers([]);
    }, [positionList]);

    useEffect(() => {
      if (positionList?.length > 0) {
        const options = { radius: 400, minZoom: 2, maxZoom: 20, minPoints: 10 };
        setVisible(true);
        InteractionManager.runAfterInteractions(() => {
          requestAnimationFrame(() => {
            const clusters = new Supercluster<any, ClusterProperties>(options).load(
              positionList.map(({ longitude, latitude, ...properties }: any) => ({
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [longitude, latitude],
                },
                properties: { longitude, latitude, ...properties },
              })),
            );
            clusterRef.current = clusters;
            setTimeout(() => {
              setVisible(false);
            }, 500);
          });
        });
      }
    }, [positionList, setVisible]);

    const onUpdate = debounce((status: any) => {
      const { cameraPosition, latLngBounds } = status;
      if (latLngBounds && type === 'home') {
        InteractionManager.runAfterInteractions(() => {
          requestAnimationFrame(() => {
            const { southwest, northeast } = latLngBounds;
            const clusters = clusterRef.current?.getClusters(
              [southwest.longitude, southwest.latitude, northeast.longitude, northeast.latitude],
              Math.round(cameraPosition.zoom!),
            );

            const markerIds = new Set(markers.map((marker: any) => marker.properties.id));

            clusters?.forEach((item: any) => {
              if (item.properties.point_count > 0) {
                if (item?.properties?.cluster_id) {
                  const children = clusterRef.current.getLeaves(item.properties.cluster_id);

                  children?.forEach((a: any) => {
                    if (!markerIds.has(a.properties.id) && !a.properties.point_count) {
                      setMarkers((prev: any) => uniqueMarkers([...prev, a]));
                      markerIds.add(a.properties.id);
                    }
                  });
                }
              }
              if (!markerIds.has(item.properties.id) && !item.properties.point_count) {
                setMarkers((prev: any) => uniqueMarkers([...prev, item]));
                markerIds.add(item.properties.id);
              }
            });
          });
        });
      }
      setVisible(false);
    });

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
        zoomGesturesEnabled={['nearPosition'].includes(type) ? false : true}
        scrollGesturesEnabled={['nearPosition'].includes(type) ? false : true}
        initialCameraPosition={{ zoom: 16.5, target: location }}
        onCameraIdle={({ nativeEvent }: any) => {
          // setVisible(true);
          if (positionList?.length > 0) {
            onUpdate(nativeEvent);
          }
          if (type === 'markerLocation') {
            setLocationMarkers([{ target: nativeEvent.target, ...nativeEvent.cameraPosition.target }]);
          }
          setLocation(nativeEvent.cameraPosition.target);
          setVisible(false);
        }}
        onPress={({ nativeEvent }) => {
          if (type === 'markerLocation') {
            mapViewRef.current?.moveCamera(
              {
                target: { latitude: nativeEvent.latitude, longitude: nativeEvent.longitude },
              },
              100,
            );
            setLocationMarkers([nativeEvent]);
          }
        }}
      >
        {type === 'home'
          ? markers?.map((item: any) => {
              const info = item?.properties;
              const imageUrl = info?.icon;
              const iconUrl = markerLocationIconUrls[info?.color ?? 1];
              const bgImgUrl = markerLocationBgIcons[info?.color ?? 1];
              const isTask = info?.type === 'task';
              if (isTask) {
                return (
                  <Marker
                    ref={MarkerRef}
                    icon={{ uri: imageUrl, cache: 'force-cache' }}
                    key={info.id}
                    position={{
                      latitude: info.latitude,
                      longitude: info.longitude,
                    }}
                    onPress={() => {
                      onMarkerPress(info);
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
                      ? { uri: imageUrl, width: 20, height: 20, cache: 'force-cache' }
                      : { uri: iconUrl, width: 30, height: 35, cache: 'force-cache' }
                  }
                  key={info.id}
                  position={{
                    latitude: info.latitude,
                    longitude: info.longitude,
                  }}
                  onPress={() => {
                    onMarkerPress(info);
                  }}
                  name={isShowName ? info?.name : null}
                />
              );
            })
          : null}
        {type === 'markerLocation' || type === 'nearPosition'
          ? locationMarkers.map((position: any) => (
              <Marker
                key={`${position.latitude},${position.longitude}`}
                position={position}
                onPress={() => {
                  locationMarkers.splice(markers.indexOf(position), 1);
                  setLocationMarkers([...locationMarkers]);
                }}
              >
                <View style={{ padding: 5, width: 30, height: 35 }}>
                  <Image source={defaultIcon as any} style={{ width: '100%', height: '100%' }} />
                </View>
              </Marker>
            ))
          : null}
      </MapView>
    );
  },
);
