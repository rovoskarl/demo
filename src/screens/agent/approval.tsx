import { Platform, SafeAreaView, TouchableOpacity } from 'react-native';
import { Image, Text, XStack, YStack, View } from 'tamagui';
import { ComponentType, useCallback, useMemo, useState } from 'react';
import { SceneMap, TabView } from 'react-native-tab-view';
import { useService } from './hooks/useService';
import { useService as useMapService } from '../map/hooks/useService';
import { ROUTER_FLAG, ScreenNavigationProp } from '@/src/navigation';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useLocation, useMapInfo, usePosition } from '../map/hooks';
import { useLoader } from '@/src/hooks';
import { FlashList } from '@shopify/flash-list';

const Types = [
  {
    key: '1',
    title: '待处理',
  },
  {
    key: '2',
    title: '已处理',
  },
  // {
  //   key: '3',
  //   title: '抄送我',
  // },
  {
    key: '4',
    title: '我的申请',
  },
];

export function ApprovalScreen() {
  const { getTodoList, getDoneList, getMyApplyList } = useService();
  const [activeKey, setActiveKey] = useState<number>(0);
  const { setPositionInfo } = usePosition();
  const { setLocation } = useLocation();
  const {
    mapInfo: { id: mapId },
    updateMapInfo,
  } = useMapInfo();
  const [data, setData] = useState<any>({
    '1': [],
    '2': [],
    // '3': [],
    '4': [],
  });
  const { getPositionDetail } = useMapService();
  const { setVisible } = useLoader();
  const navigation = useNavigation<ScreenNavigationProp>();

  useFocusEffect(
    useCallback(() => {
      Promise.all([
        getTodoList(),
        getDoneList({ pageNum: 1, pageSize: -1 }),
        getMyApplyList({ pageNum: 1, pageSize: -1 }),
      ]).then(([data1, data2, data3]) => {
        setData({
          '1': data1,
          '2': data2?.result,
          // '3': data3?.result,
          '4': data3?.result,
        });
      });
      return () => {
        setData({
          '1': [],
          '2': [],
          '4': [],
        });
      };
    }, [getDoneList, getMyApplyList, getTodoList]),
  );

  const renderTabBar = (props: any) => {
    return (
      <View paddingHorizontal={10} paddingTop={10}>
        <XStack space="$6" paddingHorizontal={12}>
          {props.navigationState.routes.map((route: { title: string; key: string }, index: number) => {
            const checked = activeKey === index;
            const { title, key } = route;
            return checked ? (
              <YStack alignItems="center" key={`${title}-${key}`}>
                <XStack>
                  <Text fontSize={16} fontWeight={'500'} lineHeight={24}>
                    {title}
                  </Text>
                  {data['1']?.length > 0 && key === '1' ? (
                    <View width={5} height={5} backgroundColor="#E24A4A" borderRadius={5} />
                  ) : null}
                </XStack>

                <View
                  style={{
                    height: 3,
                    width: 20,
                    backgroundColor: '#00BBB4',
                    marginTop: 4,
                    borderRadius: 10,
                  }}
                />
              </YStack>
            ) : (
              <TouchableOpacity
                key={key}
                onPress={() => {
                  setActiveKey(index);
                }}
              >
                <Text fontSize={14} lineHeight={24}>
                  {title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </XStack>
      </View>
    );
  };

  const renderScene = useMemo(() => {
    const sceneMapObj: { [key: string]: ComponentType<unknown> } = {};

    Types.forEach((item) => {
      sceneMapObj[item.key] = () => {
        return (
          <View className="h-full w-full" backgroundColor="#F5F5F5">
            <FlashList
              removeClippedSubviews={Platform.OS === 'android'}
              onEndReachedThreshold={0.3}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={data?.[item.key]}
              keyExtractor={(_item: any) => _item?.id}
              estimatedItemSize={300}
              renderItem={({ item: _item }) => {
                return (
                  <View
                    key={_item.id}
                    flex={1}
                    backgroundColor="$white"
                    paddingHorizontal={16}
                    paddingVertical={12}
                    borderRadius={9}
                    onPress={() => {
                      setVisible(true);
                      getPositionDetail(_item?.businessId).then((res: any) => {
                        if (mapId !== res?.mapId) {
                          updateMapInfo({ id: res?.mapId, name: res?.mapName });
                        }
                        setPositionInfo(res);
                        setLocation({ latitude: res?.latitude, longitude: res?.longitude });

                        navigation.navigate(ROUTER_FLAG.MapPointDetail, {
                          entry: 'EVALUATION',
                          latitude: res?.latitude,
                          longitude: res?.longitude,
                        });
                        setTimeout(() => {
                          setVisible(false);
                        }, 500);
                      });
                    }}
                  >
                    {_item?.operationStatus === 2 ? (
                      <Image
                        style={{
                          position: 'absolute',
                          right: 0,
                          zIndex: 1,
                        }}
                        source={require('@/src/screens/agent/images/pass.png')}
                      />
                    ) : null}
                    {_item?.operationStatus === 3 ? (
                      <Image
                        style={{
                          position: 'absolute',
                          right: 0,
                          zIndex: 1,
                        }}
                        source={require('@/src/screens/agent/images/fail.png')}
                      />
                    ) : null}
                    {_item?.operationStatus === 5 ? (
                      <Image
                        style={{
                          position: 'absolute',
                          right: 0,
                          zIndex: 1,
                        }}
                        source={require('@/src/screens/agent/images/turnDown.png')}
                      />
                    ) : null}

                    <XStack justifyContent="space-between" position="relative">
                      <Text fontSize={16} lineHeight={24} fontWeight="bold" color="#141414" maxWidth="80%">
                        {_item?.flowName}
                      </Text>

                      {_item?.operationStatus === 1 ? (
                        <Text fontSize={14} color="#00BBB4" lineHeight={22}>
                          待审核
                        </Text>
                      ) : null}
                      {_item?.operationStatus === 4 ? (
                        <Text fontSize={14} color="#B8B8B8" lineHeight={22}>
                          已撤回
                        </Text>
                      ) : null}
                    </XStack>
                    <XStack gap={2} marginTop={12} borderRadius={6} backgroundColor="#FAFAFA" padding={12}>
                      <YStack marginRight={20}>
                        <Text fontSize={14} color="#5E5E5E" lineHeight={22}>
                          审核对象
                        </Text>
                        <Text fontSize={14} color="#5E5E5E" lineHeight={22}>
                          提交人
                        </Text>
                        <Text fontSize={14} color="#5E5E5E" lineHeight={22}>
                          提交时间
                        </Text>
                      </YStack>
                      <YStack flex={1}>
                        <Text fontSize={14} color="#141414" lineHeight={22} numberOfLines={1}>
                          {_item?.businessName}
                        </Text>
                        <Text fontSize={14} color="#141414" lineHeight={22} numberOfLines={1}>
                          {_item?.createUserName}
                        </Text>
                        <Text fontSize={14} color="#141414" lineHeight={22} numberOfLines={1}>
                          {_item?.createTime}
                        </Text>
                      </YStack>
                    </XStack>
                  </View>
                );
              }}
            />
          </View>
        );
      };
    });
    return SceneMap(sceneMapObj);
  }, [data, getPositionDetail, mapId, navigation, setLocation, setPositionInfo, setVisible, updateMapInfo]);

  return (
    <SafeAreaView className="flex-1">
      <View className="w-full h-full" backgroundColor="$white" borderTopWidth={1} borderColor="#F0F0F0">
        <TabView
          navigationState={{ index: activeKey, routes: Types }}
          renderTabBar={renderTabBar}
          onIndexChange={setActiveKey}
          renderScene={renderScene}
        />
      </View>
    </SafeAreaView>
  );
}
