import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { XStack, YStack, View, Text, Button } from 'tamagui';
import { TouchableOpacity } from 'react-native';
import { Close } from '@/src/icons';
import { ComponentType, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BusinessConfigDTO, useBusinessConfigDetail, useLocation, usePosition, usePositionDetail } from '../map/hooks';
import { useNavigation } from '@react-navigation/native';
import { ROUTER_FLAG, ScreenNavigationProp } from '@/src/navigation';
import { ScrollView } from 'react-native-gesture-handler';
import { TabView, SceneMap } from 'react-native-tab-view';
import { CustomFieldGroupIdEnum, FieldsForm } from '../map/components/FieldsForm';
import { NearPosition } from '../map/components/NearPositionList';
import { Timeline } from './TimeLine';
import { NavigationSheet } from '../map/components/NavigationSheet';
import { Tag } from '../map/components/Tag';
import { useAuditHistory, useService } from './hooks/useService';
import { WithAuth } from '@/src/components';
import { ButtonPermission } from '../map/constant/constants';
import { useUser } from '@/src/hooks';
import { OperationRecord } from './OperationRecord';

const Types = [
  { key: '1', title: '审核表单' },
  { key: '2', title: '详细信息' },
  { key: '3', title: '附近点位' },
  { key: '4', title: '审核记录' },
  { key: '5', title: '操作记录' },
];

export const MarkerLocationDetail = WithAuth(({ entry = 'DETAIL', permissions }: any) => {
  const hasEditCollectInfo = permissions?.find(
    (item: any) => item.url === ButtonPermission.POSITION_COLLECT_MAP_EDIT_COLLECT_INFO,
  );
  const [activeKey, setActiveKey] = useState<number>(0);

  const { positionInfo: markerDetail } = usePosition();
  const snapPoints = ['50%', '100%'];
  const { detail, getPositionDetail } = usePositionDetail();
  const { distance, getDistance } = useLocation();

  const navigation = useNavigation<ScreenNavigationProp>();
  const { user } = useUser();

  const { getBusinessConfigDetail } = useService();
  const { setBusinessConfigDetail } = useBusinessConfigDetail();
  const bottomSheetRef = useRef<any>(null);
  const { auditHistory } = useAuditHistory(detail?.processInstanceId);
  const isCreator = detail?.createUserId === user?.shUserId;
  useEffect(() => {
    if (markerDetail?.latitude && markerDetail?.longitude) {
      getDistance({ latitude: markerDetail?.latitude, longitude: markerDetail?.longitude });
    }
  }, [getDistance, markerDetail?.latitude, markerDetail?.longitude]);

  useEffect(() => {
    if (markerDetail?.id) {
      // mapViewRef.current?.moveCamera(
      //   {
      //     zoom: 16.5,
      //     target: { latitude, longitude },
      //   },
      //   1000,
      // );

      getPositionDetail({ id: markerDetail.id, type: markerDetail?.positionType });
    }
  }, [getPositionDetail, markerDetail.id, markerDetail?.positionType]);

  useEffect(() => {
    getBusinessConfigDetail({ configId: 1 }).then((res) => {
      setBusinessConfigDetail(res as BusinessConfigDTO);
    });
  }, [getBusinessConfigDetail, setBusinessConfigDetail]);

  const filteredTypes = useMemo(
    () =>
      Types.filter((item) => {
        if (item.key === '4') {
          return markerDetail?.positionType === 1;
        }
        if (item.key === '1') {
          return entry !== 'DETAIL';
        }
        return true;
      }),
    [entry, markerDetail?.positionType],
  );

  const onHandleEdit = useCallback(() => {
    navigation.navigate(ROUTER_FLAG.MapMarkerLocationInfo, {
      isEdit: true,
      buttonText: '保存',
    });
  }, [navigation]);

  const onHandleApprovalReject = () => {
    navigation.navigate(ROUTER_FLAG.ApprovalReject);
  };

  const onHandleApprovalPass = () => {
    navigation.navigate(ROUTER_FLAG.ApprovalPass);
  };

  const onHandleApprovalTurnDown = () => {
    navigation.navigate(ROUTER_FLAG.ApprovalTurnDown);
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

  const infoType = useMemo(() => {
    if (markerDetail?.positionType === 2) {
      return 'ShopInfo';
    }
    if (markerDetail?.positionType === 3) {
      return 'PoiInfo';
    }

    if (markerDetail?.positionType === 1) {
      return 'PinMapInfo';
    }
    return 'PinMapInfo';
  }, [markerDetail?.positionType]);

  const renderScene = useMemo(() => {
    const sceneMapObj: { [key: string]: ComponentType<unknown> } = {};

    filteredTypes.forEach((item) => {
      sceneMapObj[item.key] = () => {
        if (item.key === '1') {
          return (
            <FieldsForm isEdit={true} data={detail} templateId={CustomFieldGroupIdEnum.PinMapCollectionInfo} disabled />
          );
        }
        if (item.key === '2') {
          return <FieldsForm isEdit={true} data={detail} templateId={CustomFieldGroupIdEnum[infoType]} disabled />;
        }
        if (item.key === '3') {
          return (
            <View
              backgroundColor="$white"
              className="m-3 "
              borderRadius={10}
              paddingHorizontal={12}
              paddingVertical={12}
            >
              <NearPosition />
            </View>
          );
        }
        if (item.key === '4') {
          return (
            <View className="m-3" borderRadius={10} backgroundColor="$white">
              <View className="h-full">
                <ScrollView showsHorizontalScrollIndicator={false}>
                  <View padding={12} backgroundColor="$white" borderRadius="$5" marginTop={4}>
                    {auditHistory && <Timeline events={auditHistory} />}
                  </View>
                </ScrollView>
              </View>
            </View>
          );
        }
        return (
          <View className="m-3" borderRadius={10} backgroundColor="$white">
            <View className="h-full">
              <OperationRecord />
            </View>
          </View>
        );
      };
    });
    return SceneMap(sceneMapObj);
  }, [auditHistory, detail, filteredTypes, infoType]);

  const isShowButton =
    (entry === 'DETAIL' && detail?.positionType === 1 && detail?.status === 1) ||
    (entry === 'EVALUATION' && detail?.flowOperationStatus === 5) ||
    (entry === 'EVALUATION' && detail?.flowOperationStatus === 1) ||
    hasEditCollectInfo ||
    isCreator;

  useEffect(() => {
    const ref = bottomSheetRef.current;
    return () => {
      if (ref) {
        ref.close();
      }
    };
  }, []);
  return (
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
                    {detail?.positionType === 1 && (
                      <View>
                        {entry === 'DETAIL' ? (
                          <Tag type={1}>
                            {detail?.status === 1 ? '待评估' : null}
                            {detail?.status === 2 ? '已采集' : null}
                            {detail?.status === 3 ? '入库' : null}
                            {detail?.status === 4 ? '待定' : null}
                            {detail?.status === 5 ? '无效' : null}
                            {detail?.status === 6 ? '已释放' : null}
                            {detail?.status === 7 ? '已分配' : null}
                            {detail?.status === 8 ? '已签店' : null}
                          </Tag>
                        ) : null}
                        {entry === 'EVALUATION' ? (
                          <Tag type={1}>
                            {detail?.flowOperationStatus === 1 ? '待审核' : null}
                            {detail?.flowOperationStatus === 2 ? '审核通过' : null}
                            {detail?.flowOperationStatus === 3 ? '审核不通过' : null}
                            {detail?.flowOperationStatus === 4 ? '撤回' : null}
                            {detail?.flowOperationStatus === 5 ? '驳回' : null}
                          </Tag>
                        ) : null}
                      </View>
                    )}
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
                <Text className="text-black text-lg font-medium w-3/4" ellipsizeMode="tail">
                  {detail?.name ?? detail?.shopPosition?.name}
                </Text>
                <XStack className="w-3/4" space="$2" marginBottom={21} marginTop={4}>
                  <Text className="text-secondary-paragraph-dark text-xs" marginBottom={4}>
                    距你 {distance} 公里｜ {detail?.address ?? detail?.shopPosition?.address}
                  </Text>
                </XStack>
              </View>
            </YStack>

            <TabView
              navigationState={{ index: activeKey, routes: filteredTypes }}
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
          {entry === 'DETAIL' &&
          detail?.positionType === 1 &&
          detail?.status === 1 &&
          (hasEditCollectInfo || isCreator) ? (
            <Button
              backgroundColor="$primaryLight"
              color="$white"
              fontSize={16}
              fontWeight={'500'}
              onPress={onHandleEdit}
            >
              修改采集信息
            </Button>
          ) : null}

          {entry === 'EVALUATION' && detail?.flowOperationStatus === 5 ? (
            <Button
              backgroundColor="$primaryLight"
              color="$white"
              fontSize={16}
              fontWeight={'500'}
              onPress={onHandleEdit}
            >
              修改采集信息
            </Button>
          ) : null}

          {entry === 'EVALUATION' && detail?.flowOperationStatus === 1 ? (
            <XStack alignItems="center" justifyContent="center" space={12} paddingHorizontal={6}>
              <Button
                fontSize={16}
                padding={0}
                fontWeight={'500'}
                width={'20%'}
                chromeless
                onPress={onHandleApprovalTurnDown}
              >
                驳回
              </Button>
              <Button
                backgroundColor="$white"
                color="#5E5E5E"
                borderStyle="solid"
                borderWidth={1}
                borderColor={'#DCDCDC'}
                fontSize={16}
                fontWeight={'500'}
                width={'40%'}
                onPress={onHandleApprovalReject}
              >
                不通过
              </Button>
              <Button
                backgroundColor="$primaryLight"
                color="$white"
                fontSize={16}
                fontWeight={'500'}
                width={'40%'}
                onPress={onHandleApprovalPass}
              >
                通过
              </Button>
            </XStack>
          ) : null}
        </View>
      )}
    </>
  );
});
