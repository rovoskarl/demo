import * as React from 'react';
import { StyleSheet } from 'react-native';
import { MapType, MapView, Marker, Polygon } from '@tastien/react-native-amap3d';
import { useCallback, useEffect, useRef, useState } from 'react';
import Supercluster, { ClusterProperties } from 'supercluster';
import { useShowConfig, useGroupMapSelection } from '../hooks';
import { markerLocationBgIcons, markerLocationIconUrls, pointCheckedIcon } from '../constant/constants';

export const MapPoint = (props: {
  positionList: Record<string, any>[];
  location: any;
  mapViewRef: React.RefObject<MapView>;
  onMarkerPress: (info: any) => void;
  zoom?: boolean;
  scroll?: boolean;
  polygonPoints: any[];
  children?: React.ReactNode;
  onCameraIdle?: (status: any) => void;
}) => {
  const { positionList, location, mapViewRef, onMarkerPress, zoom = true, scroll = true, polygonPoints } = props;
  const [markers, setMarkers] = useState<any>([]);

  const clusterRef = useRef<any>(null);
  const { pointerList } = useGroupMapSelection();
  const markerRef = useRef<any>(null);
  const {
    config: { isShowName, mapType },
  } = useShowConfig();

  useEffect(() => {
    if (positionList?.length === 0) {
      setMarkers([]);
    }
  }, [positionList]);

  useEffect(() => {
    if (positionList?.length > 0) {
      const options = { radius: 200, minZoom: 3, maxZoom: 21, minPoints: 30 };
      clusterRef.current = new Supercluster<any, ClusterProperties>(options).load(
        positionList.map(({ longitude, latitude, ...properties }: any) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          properties: { longitude, latitude, ...properties },
        })),
      );
    }
  }, [positionList]);

  const onUpdate = useCallback(
    (status: any) => {
      const { cameraPosition, latLngBounds } = status;
      if (latLngBounds) {
        const { southwest, northeast } = latLngBounds;
        const clusters = clusterRef.current?.getClusters(
          [southwest.longitude, southwest.latitude, northeast.longitude, northeast.latitude],
          Math.round(cameraPosition.zoom!),
        );

        const markerIds = new Set(markers.map((marker: any) => marker.properties.id));

        clusters?.forEach((item: any) => {
          if (item.properties.point_count > 0) {
            if (item?.properties?.cluster_id) {
              const children = clusterRef.current.getLeaves(item.properties.cluster_id, 50);

              children?.forEach((a: any) => {
                if (!markerIds.has(a.properties.id) && !a.properties.point_count) {
                  setMarkers((prev: any) => [...prev, a]);
                  markerIds.add(a.properties.id);
                }
              });
            }
          }
          if (!markerIds.has(item.properties.id) && !item.properties.point_count) {
            setMarkers((prev: any) => [...prev, item]);
            markerIds.add(item.properties.id);
          }
        });
      }
    },
    [markers],
  );

  return (
    <MapView
      ref={mapViewRef}
      rotateGesturesEnabled={false}
      compassEnabled={false}
      mapType={mapType === 1 ? MapType.Standard : MapType.Satellite}
      tiltGesturesEnabled={false}
      zoomGesturesEnabled={zoom}
      zoomControlsEnabled={false}
      scrollGesturesEnabled={scroll}
      style={StyleSheet.absoluteFill}
      onCameraIdle={({ nativeEvent }) => {
        props.onCameraIdle?.(nativeEvent);
        if (positionList?.length > 0) {
          onUpdate(nativeEvent);
        }
      }}
      initialCameraPosition={{ zoom: 10, target: location }}
    >
      {polygonPoints ? (
        <Polygon
          strokeWidth={2}
          strokeColor="rgba(255, 0, 0, 1)"
          fillColor="rgba(255, 0, 0, 0.3)"
          points={polygonPoints}
        />
      ) : null}
      {markers?.map((item: any) => {
        const info = item?.properties;
        const imageUrl = info?.icon;
        const iconUrl = markerLocationIconUrls[info?.color ?? 1];
        const bgImgUrl = markerLocationBgIcons[info?.color ?? 1];
        const checked: boolean = pointerList.find(({ id }) => id === info.id) ? true : false;
        return (
          <Marker
            ref={markerRef}
            backgroundIcon={imageUrl ? { uri: bgImgUrl } : null}
            pointCheckedIcon={checked ? { uri: pointCheckedIcon } : null}
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
              console.log('marker->onpress');
              onMarkerPress(info);
            }}
            name={isShowName ? info?.name : null}
          />
        );
      })}
      {props.children}
    </MapView>
  );
};
