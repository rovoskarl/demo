import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';

import { XStack, YStack, Checkbox, Button } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { Sheet } from '@tamagui/sheet';
import { ROUTER_FLAG, ScreenNavigationProp } from '@/src/navigation';
import { Check, Close, DownOutlined, UpOutlined } from '@/src/icons';
import classNames from 'classnames';
import { useBatchExpand, useExpandPunter } from './hooks';
import { useDependency } from '@/src/ioc';
import { Toast, ToastToken } from '@/src/interfaces/notifications';
import { cloneDeep } from 'lodash-es';
import { defaultStoreImage } from './constant/constants';

/**
 * @component       PunuterListItem
 * @param item
 * @param  seperate
 * @returns
 */
const PunuterListItem = ({
  item,
  seperate,
  checkedChange,
}: {
  item: Record<string, any>;
  seperate: boolean;
  checkedChange: (item: Record<string, any>) => void;
}) => {
  const { selectedPointId } = useBatchExpand();
  let photos = item?.photos;
  let thumbnail = photos?.length ? photos[0]?.url : null;
  if (/^http:/i.test(thumbnail)) {
    thumbnail = thumbnail.replace('http', 'https');
  }
  const checked = selectedPointId.includes(item.id);
  return (
    <TouchableOpacity
      onPress={() => {
        checkedChange(item);
      }}
    >
      <View
        className={classNames('w-full bg-white flex flex-row', {
          'rounded-lg': seperate,
          'mb-2': seperate,
        })}
      >
        <View className="my-4 mx-3">
          {thumbnail ? (
            <Image
              className="rounded-md"
              width={48}
              height={48}
              style={{ width: 48, height: 48 }}
              defaultSource={defaultStoreImage}
              source={{ uri: thumbnail }}
            />
          ) : (
            <Image
              className="rounded-md"
              width={48}
              height={48}
              style={{ width: 48, height: 48 }}
              source={defaultStoreImage}
            />
          )}
        </View>
        <View
          className="flex flex-row justify-between flex-grow"
          style={{ borderBottomWidth: seperate ? 0 : 1, borderColor: '#F0F0F0' }}
        >
          <View className="grow pr-6">
            <View className="flex flex-row mt-4">
              <Text className="grow text-base font-bold text-black w-3/5" ellipsizeMode={'tail'} numberOfLines={1}>
                {item.name}
              </Text>
            </View>
            <View className="flex flex-row mt-2">
              <Text
                className="grow text-xs w-3/5"
                style={{ color: '#858585' }}
                ellipsizeMode={'tail'}
                numberOfLines={1}
              >
                {item.adname}
                {item.address}
              </Text>
            </View>
          </View>
          <View className="flex flex-row">
            <Checkbox
              id={`selection_${item.id}_${new Date().getTime()}`}
              size="$4"
              value={item.id}
              checked={checked}
              onCheckedChange={() => {
                checkedChange(item);
              }}
              className="mt-8 mr-4 rounded-2xl bg-white"
            >
              <Checkbox.Indicator className="w-full h-full bg-primary items-center justify-center rounded-2xl">
                <Check color="#fff" width="16" height="16" />
              </Checkbox.Indicator>
            </Checkbox>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/**
 * @component         ExpandPunterScreen
 * @description       一键拓客点位列表页面
 */
export const ExpandPunterListScreen = () => {
  console.log('ExpandPunterListScreen');
  const navigation = useNavigation<ScreenNavigationProp>();
  const [bottomSheet, setBootomSheet] = useState<boolean>(false);
  const [allPointList, setAllPointList] = useState<Record<string, any>[]>([]);
  const [selectedPointList, setSelectedPointList] = useState<Record<string, any>[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string>('');
  const [position, setPosition] = useState(0);
  const snapPoints = [80];
  const { route, refreshExpandPoint, loadExpandPoint } = useExpandPunter();
  const { getPunterStore, setSelectedPointId, setKeyword, setSelectedPointData, setImportType, setPoiList } =
    useBatchExpand();
  const { poiList, punterPointList, selectedPointData, selectedPointId } = getPunterStore();
  const toast = useDependency<Toast>(ToastToken);

  /**
   * @method    refreshPunterFlatList
   */
  const refreshPunterFlatList = useCallback(async () => {
    if (punterPointList) {
      if (selectedPointList.length === 0) {
        setSelectedPointId([]);
      }
      setAllPointList(punterPointList);
    }
  }, [punterPointList, selectedPointList, setSelectedPointId]);

  useEffect(() => {
    refreshPunterFlatList();
  }, [refreshPunterFlatList]);

  useEffect(() => {
    const params = route.params;
    console.log(route.params);
    const newKeyword = params?.data?.keyword;
    if (params?.data?.keyword) {
      setSearchKey(newKeyword);
      setKeyword(newKeyword);
    }
    if (params?.data?.action === 'importToback' && selectedPointList.length === 0) {
      setSelectedPointList(selectedPointData || []);
    }
  }, [selectedPointData, selectedPointList, route, setKeyword, setSearchKey, setSelectedPointList]);
  /**
   * @method         updateCheckValue
   * @param value
   * @param id
   */
  const updateCheckValue = (item: Record<string, any>) => {
    const checked = selectedPointId.includes(item.id);
    let checkIds = [];
    if (checked) {
      checkIds = selectedPointId.filter((elem) => elem !== item.id);
    } else {
      checkIds = [...selectedPointId, item.id];
    }
    setSelectedPointId(checkIds);
    let cloneAllPointList = cloneDeep(allPointList);
    const selectedItem = cloneAllPointList.filter((elem) => checkIds.includes(elem.id));
    console.log(checkIds, selectedItem);
    setSelectedPointList([...selectedItem]);
  };
  /**
   * @method              validImportSelectedData
   * @param pointerList
   */
  const validImportSelectedData = () => {
    console.log(poiList?.length);
    if (selectedPointList?.length) {
      setImportType('part');
      setPoiList(selectedPointList);
      setSelectedPointData(selectedPointList);
      navigation.navigate(ROUTER_FLAG.ExpandPunter, {
        action: 'import',
        panel: 'importStyle',
        data: {
          type: 'part',
        },
      });
    } else {
      toast.show('请选择点位数据');
    }
  };
  return (
    <SafeAreaView className="flex-1">
      <FlatList
        className="grow border-gray-200 border-t"
        data={allPointList}
        renderItem={({ item }) => <PunuterListItem item={item} seperate={false} checkedChange={updateCheckValue} />}
        keyExtractor={(item) => `${item.id}_${item.location}`}
        refreshing={refresh}
        onRefresh={() => {
          setRefresh(true);
          refreshExpandPoint(searchKey).then(() => {
            setRefresh(false);
          });
        }}
        onEndReached={async () => {
          console.log('onEndReached');
          await loadExpandPoint(searchKey);
          refreshPunterFlatList();
        }}
      />
      <View className="bg-white w-full border-gray-200 border-t">
        <View className="mt-2 mb-2">
          <TouchableOpacity onPress={() => setBootomSheet(true)}>
            <View className="ml-4 flex flex-row">
              <UpOutlined width={20} height={20} />
              <Text className="text-sm text-teal-400 ml-2.5">已选{selectedPointList.length}个点位,点击查看</Text>
            </View>
          </TouchableOpacity>
        </View>
        <XStack space justifyContent="center" backgroundColor="$white" width={'100%'} bottom={0} paddingBottom={8}>
          <Button
            className="bg-white"
            borderColor={'#CCC'}
            borderWidth={1}
            width={'44%'}
            borderRadius="$3.5"
            fontSize={16}
            marginTop="$2"
            height="$4"
            onPress={() => {
              setImportType('all');
              navigation.navigate(ROUTER_FLAG.ExpandPunter, {
                action: 'import',
                panel: 'importStyle',
                data: {
                  type: 'all',
                  keyword: searchKey,
                },
              });
            }}
          >
            一键导入全部
          </Button>
          <Button
            backgroundColor="$primaryLight"
            color="$white"
            width={'44%'}
            borderRadius="$3.5"
            fontSize={16}
            marginTop="$2"
            height="$4"
            onPress={() => {
              validImportSelectedData();
            }}
          >
            导入已选(<Text className="text-base text-white">{selectedPointList.length}</Text>)
          </Button>
        </XStack>
      </View>
      <View style={{ position: 'relative' }}>
        <View className="flex-1">
          <Sheet
            forceRemoveScrollEnabled={bottomSheet}
            modal
            open={bottomSheet}
            onOpenChange={setBootomSheet}
            snapPoints={snapPoints}
            snapPointsMode={'percent'}
            dismissOnSnapToBottom
            position={position}
            onPositionChange={setPosition}
            zIndex={100_000}
            animation="medium"
          >
            <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
            <Sheet.Frame>
              <XStack paddingHorizontal={24} paddingVertical={12} justifyContent="space-between" alignItems="center">
                <Text className="text-xl font-medium text-black">已选点位（{selectedPointId.length}）</Text>
                <TouchableOpacity
                  onPress={() => {
                    setBootomSheet(false);
                  }}
                >
                  <Close />
                </TouchableOpacity>
              </XStack>
              <View className="flex-1 w-full">
                <YStack className="grow" paddingHorizontal={12} paddingBottom={12}>
                  <ScrollView
                    className="mb-16"
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                  >
                    {selectedPointList?.map((item) => {
                      return (
                        <PunuterListItem
                          key={`${item.id}_${item.cityname}`}
                          item={item}
                          seperate={true}
                          checkedChange={updateCheckValue}
                        />
                      );
                    })}
                  </ScrollView>
                </YStack>
                <View className="w-full bg-white px-3 py-2 border-gray-200 border-t" style={{ width: '100%' }}>
                  <TouchableOpacity onPress={() => setBootomSheet(false)}>
                    <View className="flex flex-row mb-2">
                      <DownOutlined width={20} height={20} />
                      <Text className="text-sm text-teal-400 ml-2.5">已选{selectedPointId.length}个点位,点击查看</Text>
                    </View>
                  </TouchableOpacity>
                  <XStack space justifyContent="space-between" width={'100%'}>
                    <Button
                      backgroundColor="$white"
                      borderColor={'#CCC'}
                      borderWidth={1}
                      className="flex-auto"
                      borderRadius="$3.5"
                      fontSize={16}
                      marginTop="$2"
                      height="$4"
                      onPress={() => {
                        setImportType('all');
                        navigation.navigate(ROUTER_FLAG.ExpandPunter, {
                          action: 'import',
                          panel: 'importStyle',
                          data: {
                            type: 'all',
                            keyword: searchKey,
                          },
                        });
                      }}
                    >
                      一键导入全部
                    </Button>
                    <Button
                      backgroundColor="$primaryLight"
                      color="$white"
                      className="flex-auto"
                      borderRadius="$3.5"
                      fontSize={16}
                      marginTop="$2"
                      height="$4"
                      onPress={() => {
                        validImportSelectedData();
                      }}
                    >
                      导入已选<Text className="text-base text-white">({selectedPointList.length})</Text>
                    </Button>
                  </XStack>
                </View>
              </View>
            </Sheet.Frame>
          </Sheet>
        </View>
      </View>
    </SafeAreaView>
  );
};
