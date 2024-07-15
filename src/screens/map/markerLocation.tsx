import * as React from 'react';
import { View } from 'react-native';
import { PositionButton } from './components';
import { useCallback, useEffect, useState, useRef } from 'react';
import { MAP_KEY_WEB } from './constant/constants';
import { useLocation, useRenderType } from './hooks';
import { Close, MapPlace, Search } from '@/src/icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Text, TouchableOpacity } from 'react-native';
import { Input, ListItem, XStack, YStack } from 'tamagui';
import { ScrollView } from 'react-native-gesture-handler';
import { MapView } from '@tastien/react-native-amap3d';
import { debounce } from 'lodash-es';
import { useCollectionsTaskDetail } from '../mapCollectionsTaskDetail/hooks';

export const MapMarkerLocation: React.FC<{
  moveCameraWithLocation: () => void;
  mapViewRef: React.RefObject<MapView>;
}> = ({ moveCameraWithLocation, mapViewRef }) => {
  const [mapSearchResult, setMapSearchResult] = useState<any[]>([]);
  const isMovingRef = useRef(false);

  const { update } = useRenderType();
  const {
    location: { latitude, longitude },
    locationInfo,
    setLocationInfo,
    setLocation,
  } = useLocation();
  const { clear: clearCollectionsTaskDetailInfo } = useCollectionsTaskDetail();

  const onSearch = useCallback(
    (_latitude: any, _longitude: any) => {
      fetch(
        `https://restapi.amap.com/v3/place/around?location=${_latitude},${_longitude}&key=${MAP_KEY_WEB}&offset=10&radius=1000&extensions=all`,
      )
        .then((response) => response.json())
        .then((data) => {
          const isTrue = data.status === '1' && data.info === 'OK';
          setMapSearchResult(isTrue ? data.pois : []);
          isTrue && setLocationInfo(data.pois[0]);
        })
        .catch((error) => {
          console.error(error);
          setMapSearchResult([]);
        });
    },
    [setLocationInfo],
  );

  useEffect(() => {
    if (latitude && longitude && mapViewRef) {
      if (!isMovingRef.current) {
        onSearch(latitude, longitude);

        isMovingRef.current = true;
        // mapViewRef.current?.moveCamera(
        //   {
        //     zoom: 16.5,
        //     target: { latitude, longitude },
        //   },
        //   100,
        // );
        setTimeout(() => {
          isMovingRef.current = false;
        }, 200);
      }
    }
  }, [latitude, longitude, mapViewRef, onSearch]);

  const debouncedChangeLocation = debounce((data) => {
    changeLocation(data);
  }, 10);

  const changeLocation = (data: any) => {
    const [_longitude, _latitude] = data.location.split(',');
    const latLng = { latitude: Number(_latitude), longitude: Number(_longitude) };
    // 检查新的位置是否与当前位置不同
    if (latLng.latitude !== latitude || latLng.longitude !== longitude) {
      setLocation({ ...data, ...latLng });
      onSearch(latLng.latitude, latLng.longitude);
      mapViewRef.current?.moveCamera(
        {
          target: { latitude: latLng.latitude, longitude: latLng.longitude },
        },
        100,
      );
    }
  };

  const onSearchKeyword = useCallback(
    (text: string) => {
      if (text) {
        fetch(
          `https://restapi.amap.com/v3/place/text?keywords=${encodeURIComponent(
            text,
          )}&key=${MAP_KEY_WEB}&offset=10&extensions=all`,
        )
          .then((response) => response.json())
          .then((data) => {
            const isTrue = data.status === '1' && data.info === 'OK';
            setMapSearchResult(isTrue ? data.pois : []);
            isTrue && setLocationInfo(data.pois[0]);
          })
          .catch((error) => {
            console.error(error);
            setMapSearchResult([]);
          });
      } else {
        onSearch(latitude, longitude);
      }
    },
    [latitude, longitude, onSearch, setLocationInfo],
  );

  const chooseLocation = useCallback(
    (info: any) => {
      const [_longitude, _latitude] = info.location.split(',');
      const latLng = { latitude: Number(_latitude), longitude: Number(_longitude) };
      setLocation({ ...info, ...latLng });
      setLocationInfo(info);
      update('nearPosition');
    },
    [setLocation, setLocationInfo, update],
  );

  return (
    <>
      <PositionButton bottom="52%" onPress={() => moveCameraWithLocation()} />
      <View className="flex-1">
        <BottomSheet snapPoints={['100%']} keyboardBehavior="interactive" handleStyle={{ display: 'none' }}>
          <BottomSheetView style={{ flex: 1 }}>
            <YStack marginHorizontal={16} marginVertical={12}>
              <XStack justifyContent="space-between" alignItems="center">
                <Text className="text-lg font-medium" style={{ color: '#141414' }}>
                  标记位置
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    update('home');
                    clearCollectionsTaskDetailInfo();
                  }}
                >
                  <Close />
                </TouchableOpacity>
              </XStack>
              <XStack backgroundColor="#F5F5F5" marginTop={12} borderRadius={8} alignItems="center" paddingLeft={12}>
                <Search width={16} height={16} marginTop={3} />
                <Input
                  placeholder={'搜索'}
                  borderWidth={0}
                  backgroundColor="#F5F5F5"
                  onChangeText={onSearchKeyword}
                  paddingLeft={10}
                />
              </XStack>

              <ScrollView
                className="mt-4 mb-16"
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
                {mapSearchResult?.map((item) => {
                  return (
                    <TouchableOpacity key={item.id} onPress={() => debouncedChangeLocation(item)}>
                      <ListItem
                        title={
                          <XStack alignItems="center" marginTop={12}>
                            <MapPlace width={16} height={16} color="#141414" />
                            <Text style={{ marginLeft: 10, color: '#141414', lineHeight: 22 }}>{item.name}</Text>
                          </XStack>
                        }
                        style={{ paddingHorizontal: 14, height: 66 }}
                        subTitle={
                          <Text
                            style={{ marginLeft: 26, fontSize: 12, marginTop: -5, color: '#858585', lineHeight: 20 }}
                            numberOfLines={1}
                          >
                            {item.address}
                          </Text>
                        }
                        backgroundColor={item.id === locationInfo?.id ? '#00BBB41A' : '$white'}
                        borderRadius={8}
                        iconAfter={
                          item.id === locationInfo?.id ? (
                            <TouchableOpacity
                              onPress={() => {
                                chooseLocation(item);
                              }}
                              className="rounded-full bg-white"
                              style={{ width: 56, height: 28, borderWidth: 1, borderColor: '#00BBB4' }}
                            >
                              <Text className="text-primary text-xs text-center leading-[26px]">选择</Text>
                            </TouchableOpacity>
                          ) : null
                        }
                      />
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </YStack>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </>
  );
};
