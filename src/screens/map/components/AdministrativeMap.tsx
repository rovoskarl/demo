import * as React from 'react';
import { LatLng, MapType, MapView, Marker, Polyline } from '@tastien/react-native-amap3d';
import { MAP_KEY_WEB, markerLocationBgIcons, markerLocationIconUrls } from '../constant/constants';
import { useEffect, useRef, useState } from 'react';
import { useCountWithAdLevel, useShowConfig } from '../hooks';
import { Text, View } from 'tamagui';
import { debounce } from 'lodash-es';
import { ExpandGroupViewToast } from './ExpandGroupViewToast';

export const AdministrativeMap = ({ location, positionList }: { location: LatLng; positionList: any[] }) => {
  const { positionCounts, get } = useCountWithAdLevel();
  const [districts, setDistricts] = useState<any>([]);
  const [markers, setMarkers] = useState<any>([]);
  const [markerPoints, setMarkerPoints] = useState<any>([]);
  const zoomRef = useRef(0);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    config: { isShowName, mapType },
  } = useShowConfig();

  useEffect(() => {
    if (positionCounts?.length > 0) {
      setLoading(true);
      positionCounts.map(({ adCode, count }: any) => {
        fetch(
          `https://restapi.amap.com/v3/config/district?key=${MAP_KEY_WEB}&keywords=${adCode}&subdistrict=2&extensions=all`,
        )
          .then((response) => response.json())
          .then((response) => {
            const district = response.districts[0];

            const [longitude, latitude] = district.center?.split(',');
            setMarkers((prev: any) => [...prev, { latitude, longitude, count, name: district?.name }]);
            const blocks = district.polyline.split('|').map((block: any) => {
              const allBlock = block.split(';').map((point: any) => {
                const [_longitude, _latitude] = point.split(',');
                return {
                  latitude: Number(_latitude),
                  longitude: Number(_longitude),
                };
              });

              const simplifiedPoints = douglasPeucker(allBlock, 0.02);
              return simplifiedPoints;
            });
            setTimeout(() => {
              setLoading(false);
            }, 1000);

            setDistricts((prev: any) => [...prev, blocks]);
          });
      });
    }
  }, [positionCounts]);

  const debouncedOnCameraIdle = debounce((zoom) => {
    if (zoomRef.current === zoom) {
      return;
    }
    zoomRef.current = zoom;
    if (zoom < 5) {
      setDistricts([]);
      setMarkers([]);
      get({ adLevel: 0 });
    }
    if (zoom > 5 && zoom <= 8) {
      setDistricts([]);
      setMarkers([]);
      get({ adLevel: 1 });
    }

    if (zoom > 8) {
      setDistricts([]);
      setMarkers([]);
      get({ adLevel: 2 });
    }
  }, 1000);

  const debouncedUpdateMarkers = debounce((latLngBounds) => {
    const visiblePositions = positionList.filter((position) => {
      return (
        position.latitude >= latLngBounds.southwest.latitude &&
        position.latitude <= latLngBounds.northeast.latitude &&
        position.longitude >= latLngBounds.southwest.longitude &&
        position.longitude <= latLngBounds.northeast.longitude
      );
    });
    setMarkerPoints(visiblePositions);
  }, 1000);

  return (
    <View className="w-full h-full">
      <MapView
        rotateGesturesEnabled={false}
        compassEnabled={false}
        tiltGesturesEnabled={false}
        mapType={mapType === 1 ? MapType.Standard : MapType.Satellite}
        zoomControlsEnabled={false}
        initialCameraPosition={{ zoom: 4, target: location }}
        onCameraIdle={({
          nativeEvent: {
            cameraPosition: { zoom = 0 },
            latLngBounds,
          },
        }) => {
          debouncedOnCameraIdle(Math.round(zoom));
          if (Math.round(zoom) > 12) {
            debouncedUpdateMarkers(latLngBounds);
          }
        }}
      >
        {zoomRef.current > 12
          ? null
          : districts?.map((d: any, index: number) => {
              const color = getColorFromNumber(index);
              return d.map((block: any) => {
                return <Polyline dotted width={5} color={color} key={Math.random()} points={block} />;
              });
            })}

        {zoomRef.current > 12
          ? markerPoints.map((info: any) => {
              const imageUrl = info?.icon;
              const iconUrl = markerLocationIconUrls[info?.color ?? 1];
              const bgImgUrl = markerLocationBgIcons[info?.color ?? 1];
              const isTask = info?.type === 'task';
              if (isTask) {
                return (
                  <Marker
                    icon={{ uri: imageUrl, width: 30, height: 30, cache: 'force-cache' }}
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
                  // onPress={() => {
                  //   onMarkerPress(info);
                  // }}
                  name={isShowName ? info?.name : null}
                />
              );
            })
          : markers?.map((marker: any, index: number) => {
              const color = getColorFromNumber(index);
              return (
                <Marker
                  icon={undefined}
                  key={Math.random()}
                  position={{
                    latitude: Number(marker.latitude),
                    longitude: Number(marker.longitude),
                  }}
                >
                  <View padding={5} borderRadius={20} backgroundColor="$white">
                    <Text color={color}>{`${marker?.name}${marker?.count}`}</Text>
                  </View>
                </Marker>
              );
            })}
      </MapView>
      {loading ? <ExpandGroupViewToast type="loading" /> : null}
    </View>
  );
};

function getColorFromNumber(num: number): string {
  const colors = ['#7F93F8', '#83ADEE', '#6EC2F9', '#69DDAD', '#F5C041', '#F0974F', '#DA7C68', '#ED716B'];
  return colors[num % colors.length];
}
interface Point {
  latitude: number;
  longitude: number;
}

function douglasPeucker(points: Point[], epsilon: number): Point[] {
  let dmax = 0;
  let index = 0;
  const end = points.length - 1;

  for (let i = 1; i < end; i++) {
    const d = perpendicularDistance(points[i], points[0], points[end]);
    if (d > dmax) {
      index = i;
      dmax = d;
    }
  }

  if (dmax > epsilon) {
    const recResults1 = douglasPeucker(points.slice(0, index + 1), epsilon);
    const recResults2 = douglasPeucker(points.slice(index, end + 1), epsilon);

    const result = recResults1.slice(0, recResults1.length - 1).concat(recResults2);
    return result;
  } else {
    return [points[0], points[end]];
  }
}

function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  let dx = lineEnd.longitude - lineStart.longitude;
  let dy = lineEnd.latitude - lineStart.latitude;

  const mag = Math.sqrt(dx * dx + dy * dy);
  if (mag > 0.0) {
    dx /= mag;
    dy /= mag;
  }

  const pvx = point.longitude - lineStart.longitude;
  const pvy = point.latitude - lineStart.latitude;

  const pvdot = dx * pvx + dy * pvy;

  const ax = pvx - pvdot * dx;
  const ay = pvy - pvdot * dy;

  return Math.sqrt(ax * ax + ay * ay);
}
