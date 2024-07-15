import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { XStack, YStack, View, Text, Button } from 'tamagui';
import { TouchableOpacity } from 'react-native';
import { Close } from '@/src/icons';
import { ComponentType, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useRenderType } from '../../map/hooks';
import { useNavigation } from '@react-navigation/native';
import { ROUTER_FLAG, ScreenNavigationProp } from '@/src/navigation';
import { ScrollView } from 'react-native-gesture-handler';
import { TabView, SceneMap } from 'react-native-tab-view';
import { NavigationSheet } from '../../map/components/NavigationSheet';
import { Tag } from '../../map/components/Tag';
import { CollectedTaskStatusEnum } from '../types';
import { TaskFieldsDetailInfo } from './TaskFieldsDetailInfo';
import { useCollectionsTaskDetail, useSignedIn } from '../hooks';
import { Timeline } from '../../mapPointDetail/TimeLine';
import { SubmitPinMap } from './SubmitPinMap';
import { WithAuth } from '@/src/components';
import { useUser } from '@/src/hooks';
import { ButtonPermission } from '../../map/constant/constants';

const Types = [
  { key: '1', title: '详情信息' },
  { key: '2', title: '提交钉图' },
  { key: '3', title: '任务动态' },
];

export const CollectionsTaskDetail = WithAuth(({ permissions }: any) => {
  const { user } = useUser();
  const snapPoints = ['50%', '100%'];
  const bottomSheetRef = useRef<any>(null);
  const navigation = useNavigation<ScreenNavigationProp>();
  const { distance, location, getDistance, setLocation } = useLocation();
  const { signedIn } = useSignedIn();
  const { data: detail, clear, run } = useCollectionsTaskDetail();
  const { update } = useRenderType();

  const [activeKey, setActiveKey] = useState<number>(0);
  const [buttonType, setButtonType] = useState<'primary' | 'sign'>('primary');

  const hasCollectionTaskDispatch =
    (permissions?.find((item: any) => item.url === ButtonPermission.COLLECTION_TASK_DISPATCH) ||
      user?.shUserId === detail?.ownerUserId ||
      user?.shUserId === detail?.createUserId) &&
    !detail?.signed;

  const hasBeginTask =
    detail?.statusCode !== CollectedTaskStatusEnum.NOT_STARTED && user?.shUserId === detail?.ownerUserId;

  const hasSigned = user?.shUserId === detail?.ownerUserId && buttonType === 'sign';

  const hasCollectionTask = detail?.signed && user?.shUserId === detail?.ownerUserId;

  useEffect(() => {
    if (detail?.latitude && detail?.longitude) {
      getDistance({ latitude: detail?.latitude, longitude: detail?.longitude });
      setLocation({ latitude: detail?.latitude, longitude: detail?.longitude });
    }
    // JSON.stringify(location) mapId修改后位置变化后重新设置位置信息
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(location), detail?.latitude, detail?.longitude, getDistance, setLocation]);

  useEffect(
    () => () => {
      clear();
    },
    [clear],
  );

  const onCollectionPinMap = async () => {
    update('markerLocation');
    navigation.push(ROUTER_FLAG.Home, { screen: 'Home' });
  };

  const renderTabBar = (props: any) => {
    return (
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack space="$5" paddingHorizontal={12}>
            {props.navigationState.routes.map((route: { title: string; key: string }, index: number) => {
              const checked = activeKey === index;
              const { title, key } = route;
              return checked ? (
                <YStack alignItems="center" key={`${title}-${key}`}>
                  <Text fontSize={16} fontWeight={'500'}>
                    {title}
                  </Text>
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
                  <Text fontSize={14}>{title}</Text>
                </TouchableOpacity>
              );
            })}
          </XStack>
        </ScrollView>
      </View>
    );
  };

  const renderScene = useMemo(() => {
    const sceneMapObj: { [key: string]: ComponentType<unknown> } = {};

    Types.forEach((item) => {
      sceneMapObj[item.key] = () => {
        if (item.key === '1') {
          return !!detail && <TaskFieldsDetailInfo detail={detail} />;
        }
        if (item.key === '2') {
          return <SubmitPinMap />;
        }
        if (item.key === '3') {
          const events =
            detail?.records?.map((record, index) => ({
              id: `${record?.createTime}-${index}`,
              time: record?.createTime,
              render: () => <Text>{record?.operationContent}</Text>,
            })) || [];
          return (
            <View className="m-3" borderRadius={10} backgroundColor="$white">
              <View className="h-full">
                <ScrollView showsHorizontalScrollIndicator={false}>
                  <View padding={12} backgroundColor="$white" borderRadius="$5" marginTop={4}>
                    <Timeline events={events} />
                  </View>
                </ScrollView>
              </View>
            </View>
          );
        }
      };
    });
    return SceneMap(sceneMapObj);
  }, [detail]);

  const isShowButton = detail?.statusCode !== CollectedTaskStatusEnum.COLLECTED;
  return (
    !!detail && (
      <>
        <BottomSheet
          ref={bottomSheetRef}
          backgroundStyle={{ padding: 0, backgroundColor: '#F5F5F5' }}
          snapPoints={snapPoints}
        >
          <BottomSheetView>
            <View className="h-full w-full" style={{ paddingBottom: isShowButton ? 60 : 0 }}>
              <YStack paddingHorizontal={12} paddingTop="$2">
                <View>
                  <XStack justifyContent="space-between" alignItems="center">
                    <YStack>
                      <View>
                        <Tag type={detail?.statusCode === CollectedTaskStatusEnum.COLLECTED ? 1 : 3}>
                          {detail?.status}
                        </Tag>
                      </View>
                    </YStack>

                    <XStack space="$2">
                      <NavigationSheet
                        type="icon"
                        backgroundColor="white"
                        color="#5E5E5E"
                        borderWidth={1}
                        borderColor="#E5E5E5"
                        size="$2"
                      />

                      <TouchableOpacity
                        onPress={() => {
                          navigation.goBack();
                        }}
                      >
                        <Close />
                      </TouchableOpacity>
                    </XStack>
                  </XStack>
                  <Text className="text-black text-lg font-medium w-3/4" ellipsizeMode="tail" marginTop={4}>
                    {detail?.taskName}
                  </Text>
                  <XStack className="w-3/4" space="$2" marginBottom={21} marginTop={4}>
                    <Text className="text-secondary-paragraph-dark text-xs" marginBottom={4}>
                      距你 {distance} 公里｜ {detail?.address}
                    </Text>
                  </XStack>
                </View>
              </YStack>

              <TabView
                navigationState={{ index: activeKey, routes: Types }}
                renderTabBar={renderTabBar}
                onIndexChange={setActiveKey}
                renderScene={renderScene}
              />
            </View>
          </BottomSheetView>
        </BottomSheet>
        {isShowButton && (
          <View
            width="100%"
            backgroundColor="#ffffff"
            position="absolute"
            bottom={0}
            maxHeight={60}
            paddingHorizontal={12}
            paddingVertical={8}
          >
            {hasCollectionTask ? (
              <Button
                backgroundColor="$primaryLight"
                color="$white"
                fontSize={16}
                fontWeight={'500'}
                width={'100%'}
                onPress={() => onCollectionPinMap?.()}
              >
                采集钉图
              </Button>
            ) : hasSigned ? (
              <Button
                backgroundColor="$primaryLight"
                color="$white"
                fontSize={16}
                fontWeight={'500'}
                width={'100%'}
                onPress={async () => {
                  await signedIn({
                    taskId: detail?.id,
                    position: { longitude: detail?.longitude, latitude: detail?.latitude },
                  });
                  run();
                }}
              >
                签到打卡
              </Button>
            ) : (
              <XStack alignItems="center" justifyContent="center" space={12} paddingHorizontal={6}>
                {hasCollectionTaskDispatch && (
                  <Button
                    backgroundColor="$white"
                    color="#5E5E5E"
                    borderStyle="solid"
                    borderWidth={1}
                    borderColor={'#DCDCDC'}
                    fontSize={16}
                    fontWeight={'500'}
                    width={hasBeginTask ? '50%' : '100%'}
                    onPress={() => {
                      navigation.push(ROUTER_FLAG.TaskDispatch, {
                        taskId: detail?.id,
                      });
                    }}
                  >
                    转派
                  </Button>
                )}
                {hasBeginTask && (
                  <Button
                    backgroundColor="$primaryLight"
                    color="$white"
                    fontSize={16}
                    fontWeight={'500'}
                    width={hasCollectionTaskDispatch ? '50%' : '100%'}
                    onPress={() => setButtonType('sign')}
                  >
                    开始任务
                  </Button>
                )}
              </XStack>
            )}
          </View>
        )}
      </>
    )
  );
});
