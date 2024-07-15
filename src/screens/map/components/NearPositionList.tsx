import { bgColor, primary } from '@/src/components/Theme/colors';
import React, { ComponentType, useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, XStack, Image, YStack, Spinner } from 'tamagui';
import { useLocation, useMapInfo, useService } from '../hooks';
import { FlashList } from '@shopify/flash-list';
import { ImageBackground, Platform } from 'react-native';
import { NavigationSheet } from './NavigationSheet';
import { MAP_KEY_WEB, markerLocationBgIcons, markerLocationIconUrls } from '../constant/constants';
import { TabView, SceneMap } from 'react-native-tab-view';

const positionType = [
  {
    key: '1',
    title: '钉图',
  },
  {
    key: '2',
    title: '门店',
  },
  {
    key: '3',
    title: 'POI',
  },
];

/**
 * 距离单位换算
 * @param {number} distance - 需要转换的数值
 * @return {string} 转换后的字符串值，例如 '50米' '2千米'
 */
export const convertDistance = (distance: number): string => {
  // 小于1千米，直接返回米数
  if (distance < 1000) {
    return `${distance}米`;
  }
  // 大于等于1千米，转换为千米并保留两位小数
  else {
    return `${(distance / 1000).toFixed(2)}千米`;
  }
};

export const getDistance = (origin: [number, number], destination: [number, number]): Promise<number> => {
  return new Promise((resolve, reject) => {
    fetch(
      `https://restapi.amap.com/v3/direction/driving?origin=${origin.join(',')}&destination=${destination.join(
        ',',
      )}&output=JSON&key=${MAP_KEY_WEB}`,
    )
      .then((response) => {
        response.json().then((res) => {
          resolve(res?.route?.paths?.[0]?.distance);
        });
      })
      .catch((error) => reject(error));
  });
};

export const NearPosition = () => {
  const { getNearPositionInfo } = useService();
  const {
    location: { latitude, longitude },
  } = useLocation();
  const {
    mapInfo: { id: mapId },
  } = useMapInfo();

  const [activeKey, setActiveKey] = useState<number>(0);
  const [nearPoints, setNearPoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getNearPoint = useCallback(async () => {
    const objs = positionType.map((item) => {
      return getNearPositionInfo({
        mapId,
        latitude: latitude,
        longitude: longitude,
        positionType: item.key,
      });
    });
    setLoading(true);
    const data = await Promise.all(objs);
    setNearPoints(data);
    setLoading(false);
  }, [getNearPositionInfo, latitude, longitude, mapId]);

  useEffect(() => {
    if (mapId && latitude && longitude) {
      getNearPoint();
    }
  }, [getNearPoint, latitude, longitude, mapId]);

  const renderScene = useMemo(() => {
    const sceneMapObj: { [key: string]: ComponentType<unknown> } = {};
    positionType.forEach((item, index) => {
      sceneMapObj[item.key] = () => <NearPositionList loading={loading} data={nearPoints[index] || []} />;
    });
    return SceneMap(sceneMapObj);
  }, [nearPoints, loading]);

  const renderTabBar = (props: any) => {
    return (
      <XStack alignItems="center" space={12} marginBottom={8}>
        {props.navigationState.routes.map((route: { title: string; key: string }, index: number) => {
          const checked = activeKey === index;
          return (
            <View
              style={{
                height: 36,
                minWidth: 72,
                backgroundColor: checked ? primary[100] : bgColor.DEFAULT,
                borderColor: checked ? primary.DEFAULT : bgColor.DEFAULT,
                borderWidth: 1,
                borderRadius: 8,
              }}
              onPress={() => {
                setActiveKey(index);
              }}
              key={index}
            >
              <Text fontWeight={'400'} fontSize={13} lineHeight={34} textAlign="center">
                {route.title}
              </Text>
            </View>
          );
        })}
      </XStack>
    );
  };

  return (
    <View className="h-full">
      <TabView
        navigationState={{ index: activeKey, routes: positionType }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setActiveKey}
      />
    </View>
  );
};

export const NearPositionList = ({ data, loading }: { data: TNearPositionItem[]; loading: boolean }) => {
  return (
    <View className="h-full">
      {loading ? (
        <YStack padding="$3" space="$4" alignItems="center">
          <Spinner size="small" color="$green10" />
        </YStack>
      ) : (
        <FlashList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={Platform.OS === 'android'}
          onEndReachedThreshold={0.3}
          data={data}
          keyExtractor={(item: any) => item?.id}
          renderItem={({ item }) => <NearPositionItem item={item} />}
          estimatedItemSize={60}
        />
      )}
    </View>
  );
};

type TNearPositionItem = {
  item: {
    icon?: string;
    color?: number;
    name: string;
    distance: number;
    goDistance?: number;
    comeDistance?: number;
    longitude: number;
    latitude: number;
  };
};

export const NearPositionItem = ({ item }: TNearPositionItem) => {
  const {
    location: { latitude, longitude },
  } = useLocation();

  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState({ goDistance: 0, comeDistance: 0 });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const origin: [number, number] = [longitude, latitude];
      const destination: [number, number] = [item.longitude, item.latitude];
      const go = await getDistance(origin, destination);
      const come = await getDistance(destination, origin);
      setDistance({ goDistance: go, comeDistance: come });
      setLoading(false);
    })();
  }, [item.latitude, item.longitude, latitude, longitude]);

  const imageUrl = item.icon || null;
  const bgImgUrl = markerLocationBgIcons[item.color ?? 1];
  const iconUrl = markerLocationIconUrls[item?.color ?? 1];
  return (
    <View
      marginTop={12}
      borderColor={'#F0F0F0'}
      borderRadius={12}
      borderStyle="solid"
      borderWidth={0.5}
      backgroundColor="$white"
    >
      <YStack padding="$3" paddingBottom="$2">
        <XStack gap="$3">
          {imageUrl ? (
            <ImageBackground
              style={{
                width: 40,
                height: 48,
              }}
              source={{ uri: bgImgUrl }}
              resizeMode="cover"
              className=""
            >
              <Image
                style={{ borderRadius: 3, marginLeft: 5, marginTop: 5 }}
                width={30}
                height={30}
                source={{
                  uri: item?.icon,
                }}
              />
            </ImageBackground>
          ) : (
            <Image
              className="ml-0.5"
              style={{ borderRadius: 4 }}
              width={34}
              height={48}
              source={{
                uri: iconUrl || null,
              }}
            />
          )}
          <YStack justifyContent="space-between" flex={1}>
            <XStack alignItems="center" justifyContent="space-between">
              <View flex={1} paddingRight={8}>
                <Text
                  className="grow"
                  fontSize={14}
                  lineHeight={22}
                  fontWeight={'500'}
                  ellipsizeMode={'tail'}
                  numberOfLines={2}
                >
                  {item.name}
                </Text>
              </View>
              <NavigationSheet
                item={item}
                type="icon"
                backgroundColor="white"
                color="#5E5E5E"
                borderWidth={1}
                borderColor="#E5E5E5"
                size="$2"
              />
            </XStack>
            <View borderColor={'#F0F0F0'} borderStyle="solid" borderBottomWidth={0.5} />
          </YStack>
        </XStack>
        <XStack justifyContent="space-between" marginTop={'$2'}>
          <Text fontSize={12} color={'#858585'}>
            直线: {convertDistance(item.distance)}
          </Text>
          <Text fontSize={12} color={'#858585'}>
            去程步行: {loading ? '获取中...' : convertDistance(distance.goDistance || 0)}
          </Text>
          <Text fontSize={12} color={'#858585'}>
            返程步行: {loading ? '获取中...' : convertDistance(distance.comeDistance || 0)}
          </Text>
        </XStack>
      </YStack>
    </View>
  );
};
