import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, View, Keyboard } from 'react-native';

import { MapView } from '@tastien/react-native-amap3d';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Group, Button, Separator, Input, Text, XStack, YStack, Checkbox } from 'tamagui';

import { Check, Down, Back as BackIcon } from '@/src/icons';
import { ROUTER_FLAG } from '@/src/navigation';
import { ExpandPunterMap, MarkerImportStyleInfoSheet, PunterGroupSheet, PositionButton } from './components';
import { useExpandPunter, useBatchExpand } from './hooks';
import { Loading } from '@/src/components';
import { getUniqueArray } from '../../utils/tools';

/**
 * @component       LocationAreaBar
 * @param navigation
 * @returns
 */
const LocationAreaBar = () => {
  const [expand, setExpand] = useState<boolean>(false);
  const [search, setSearch] = useState<any>();
  const [areaName, setAreaName] = useState<string>('全部区域');
  const { navigation, queryCityAreaList, handleKeywordChange } = useExpandPunter();
  const { areaCode, keyword, selectedCity, cityAreaList } = useBatchExpand();
  const {
    getAllCityArea,
    setPanel,
    setSelectedArea,
    setKeyword,
    setAreaCode,
    setSearchPointList,
    setSearchPointCount,
    getAttribute,
  } = useBatchExpand();

  useEffect(() => {
    return () => {
      setKeyword('');
      setExpand(false);
      setAreaCode([]);
      setSelectedArea([]);
    };
  }, [setAreaCode, setKeyword, setSelectedArea]);

  /**
   * @method          selectCityArea
   * @description     选择区域
   * @param item
   */
  const selectCityArea = (item: Record<string, any>, flag: boolean) => {
    let _areaCode = getAttribute('areaCode');
    let _selectedArea = getAttribute('selectedArea');
    // 选择
    if (flag) {
      setSelectedArea(getUniqueArray([..._selectedArea, item], 'code'));
      setAreaCode(Array.from(new Set([..._areaCode, item?.code])));
    } else {
      const sequence = _selectedArea?.findIndex((elem: any) => elem.code === item?.code);
      if (sequence > -1) {
        _selectedArea?.splice(sequence, 1);
        setSelectedArea(_selectedArea);
      }
      const index = _areaCode.findIndex((elem: any) => elem === item?.code);
      if (index > -1) {
        _areaCode.splice(index, 1);
        setAreaCode(_areaCode);
      }
      console.log('6666', _selectedArea, _areaCode, sequence, index);
    }
    _selectedArea = getAttribute('selectedArea');
    if (_selectedArea.length === 0) {
      setAreaName('全部区域');
    } else {
      setAreaName(_selectedArea.map((elem: any, index: number) => index < 2 && elem.name));
    }
    console.log('7777', getAttribute('selectedArea'), getAttribute('areaCode'), flag, item);
  };

  /**
   * @method          selectAllCityArea
   * @param flag
   */
  const selectAllCityArea = (flag: boolean) => {
    if (flag) {
      setSelectedArea([...cityAreaList]);
      setAreaCode(cityAreaList.map((item: any) => item.code));
      const allCityArea = getAllCityArea();
      setAreaName(allCityArea[0]?.name);
    } else {
      setSelectedArea([]);
      setAreaCode([]);
      setAreaName('全部区域');
    }
  };

  /**
   * @method      setKeywordStatus
   * @param keywordContent
   */
  const setKeywordStatus = (keywordContent: string) => {
    console.log('setKeywordStatus', keywordContent);
    if (expand) {
      setExpand(false);
    }
    if (!keywordContent) {
      setSearchPointList([]);
      setSearchPointCount(0);
      setPanel('main');
    }
  };
  const openIconStyles = expand
    ? {
        color: 'red',
        transform: [{ rotate: '180deg' }],
      }
    : {};
  return (
    <View
      style={{
        position: 'absolute',
        top: 22,
        left: 12,
        right: 12,
        backgroundColor: '#FFF',
        borderRadius: 8,
        zIndex: 20,
      }}
    >
      <View>
        <Group orientation="horizontal">
          <Group.Item>
            <View className="ml-2 mt-2 pt-1">
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <BackIcon />
              </TouchableOpacity>
            </View>
          </Group.Item>
          <Group.Item>
            <Button
              iconAfter={<Down color={'#141414'} />}
              backgroundColor={'#FFF'}
              className="w-100 text-base border-0"
              size="$4"
              onPress={() => {
                navigation.navigate(ROUTER_FLAG.ExpandPunterCity);
              }}
            >
              {selectedCity?.name || ''}
            </Button>
          </Group.Item>
          <Separator alignSelf="stretch" vertical marginVertical={12} />
          <Group.Item>
            <Input
              width={'64%'}
              borderWidth={0}
              value={keyword}
              backgroundColor="white"
              placeholder="搜索关键词"
              onChangeText={(value) => {
                setKeyword(value ?? '');
                setSearch(value ?? '');
                setKeywordStatus(value);
              }}
              onEndEditing={() => {
                handleKeywordChange(search);
              }}
              onSubmitEditing={Keyboard.dismiss}
              // onFocus={() => {
              //   setExpand(false);
              // }}
            />
          </Group.Item>
        </Group>
      </View>
      <Separator alignSelf="stretch" width="90%" left="5%" borderColor="#F6f6f6" />
      <View>
        <XStack justifyContent="center" flex={1}>
          <Button
            className="border-0 bg-white"
            backgroundColor={'#FFF'}
            iconAfter={<Down color={expand ? '#00BBB4' : '#141414'} style={expand ? openIconStyles : {}} />}
            size="$3"
            color={expand ? '#00BBB4' : '#141414'}
            onPress={() => {
              setExpand((value) => {
                return !value;
              });
              queryCityAreaList();
            }}
          >
            {areaName}
          </Button>
        </XStack>
      </View>
      <View>
        {expand && (
          <YStack justifyContent="center" className="absolute w-full mt-0 bg-white">
            <Separator alignSelf="stretch" className="border-gray-100" />
            {cityAreaList &&
              cityAreaList?.map((elem: Record<string, string>) => {
                const checked = areaCode.includes(elem.code);
                return (
                  <View key={elem.code}>
                    <View className="flex flex-row w-full content-between">
                      <View className="justify-center items-end ml-8">
                        <Checkbox
                          size="$4"
                          checked={checked}
                          backgroundColor="$white"
                          onCheckedChange={(_checked: boolean) => {
                            // 全选
                            if (!elem.code) {
                              selectAllCityArea(_checked);
                            } else {
                              selectCityArea(elem, _checked);
                            }
                          }}
                        >
                          <Checkbox.Indicator
                            borderRadius={3}
                            style={{ backgroundColor: '#00BBB4', width: '20px', height: '20px' }}
                          >
                            <Check color="#fff" width="20px" height="20px" />
                          </Checkbox.Indicator>
                        </Checkbox>
                      </View>
                      <Text className="h-9 bg-white leading-7 mt-1 ml-2">{elem.name}</Text>
                    </View>
                    <Separator alignSelf="stretch" className="border-gray-100" />
                  </View>
                );
              })}
          </YStack>
        )}
      </View>
    </View>
  );
};

/**
 * @component         ExpandPunterScreen
 * @description       一键拓客页面
 */
export const ExpandPunterScreen = () => {
  console.log('ExpandPunterScreen');
  const mapViewRef = useRef<MapView>(null);
  const [sheetGroupOpen, setSheetGroupOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { panel, keyword, location } = useBatchExpand();
  const {
    setPanel,
    setKeyword,
    locateCurrentPosition,
    moveCurrentPosition,
    getPunterStore,
    setSearchPointList,
    setSelectedPointData,
    setCityAreaList,
    setPunterPointList,
    setPoiList,
  } = useBatchExpand();
  const { route, batchPunterImport, refreshCityLocationByCoor } = useExpandPunter();
  const { navigation } = useExpandPunter();

  useEffect(() => {
    async () => {
      console.log('getPunterStore', getPunterStore());
      await locateCurrentPosition();
      moveCurrentPosition(mapViewRef, 12);
    };
  }, [locateCurrentPosition, moveCurrentPosition, getPunterStore, refreshCityLocationByCoor, mapViewRef]);

  useEffect(() => {
    const params = route.params;
    setPanel(params?.panel || 'main');
    if (params?.data?.keyword) {
      setKeyword(params?.data?.keyword);
    }
    moveCurrentPosition(mapViewRef, 12);
  }, [route, moveCurrentPosition, setKeyword, setPanel]);

  useEffect(() => {
    return () => {
      console.log('clear store cache:ExpandPunterScreen ');
      setKeyword('');
      setSearchPointList([]);
      setSelectedPointData([]);
      setCityAreaList([]);
      setPunterPointList([]);
      setPoiList([]);
    };
  }, [setCityAreaList, setKeyword, setPoiList, setPunterPointList, setSearchPointList, setSelectedPointData]);

  /**
   * @method      handlePunterGroupPanel
   * @description 分组
   */
  const handlePunterGroupPanel = (status: boolean) => {
    setSheetGroupOpen(status);
    if (!status) {
      setPanel('importStyle');
    }
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <SafeAreaView>
      <View style={{ position: 'relative' }}>
        <ExpandPunterMap location={location} mapViewRef={mapViewRef} />
        <PositionButton
          onPress={() => {
            locateCurrentPosition();
            moveCurrentPosition(mapViewRef, 18);
          }}
        />
        {/* 搜索框 */}
        <LocationAreaBar />
        {/** 目标点位统计 */}
        <View>{panel === 'pointCount' ? <PointCountPanel /> : null}</View>
        {/** 选择导入样式 */}
        <View className="flex-1">
          {panel === 'importStyle' ? (
            <MarkerImportStyleInfoSheet
              onClose={() => {
                navigation.navigate(ROUTER_FLAG.ExpandPunterList, {
                  data: {
                    keyword: keyword,
                    action: 'importToback',
                  },
                });
              }}
              forwardPunterGroup={() => {
                setPanel('main');
                handlePunterGroupPanel(true);
              }}
            />
          ) : null}
        </View>
        {/** 选择分组 */}
        <View className="flex-1">
          {sheetGroupOpen ? (
            <PunterGroupSheet
              open={sheetGroupOpen}
              onOpenChange={handlePunterGroupPanel}
              cancelText=""
              handleText="导入到此"
              cancelAction={() => {}}
              handlerAction={() => {
                setLoading(true);
                try {
                  const closeLoading = () => setLoading(false);
                  batchPunterImport(closeLoading);
                } catch (err) {
                  setLoading(false);
                }
              }}
            />
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
};

/**
 * @component         PointCountPanel
 * @param navigation
 * @param pointList
 * @returns
 */
const PointCountPanel = () => {
  console.log('PointCountPanel');
  const { navigation } = useExpandPunter();
  const { keyword, searchPointCount } = useBatchExpand();
  return (
    <View className="absolute w-full bg-white left-0 bottom-0 px-4 py-4 rounded-t-lg">
      <XStack justifyContent="center" marginTop={30}>
        <Text fontFamily="$body" className="text-lg leading-10">
          约
        </Text>
        <Text fontFamily="$body" className="text-3xl leading-10">
          {searchPointCount}
        </Text>
        <Text fontFamily="$body" className="text-lg leading-10">
          个目标点位
        </Text>
      </XStack>
      <Button
        backgroundColor="$primaryLight"
        color="$white"
        borderRadius="$3.5"
        fontSize={16}
        marginTop="$4"
        height="$4"
        onPress={() => {
          navigation.navigate(ROUTER_FLAG.ExpandPunterList, {
            data: {
              keyword: keyword,
            },
          });
        }}
      >
        去选择点位
      </Button>
    </View>
  );
};
