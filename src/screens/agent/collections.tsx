import * as React from 'react';
import { FlatList, Platform, SafeAreaView, TouchableOpacity } from 'react-native';
import { Button, ButtonProps, Checkbox, Input, Sheet, SheetProps, Text, View, XGroup, XStack, YStack } from 'tamagui';
import { Back, Check, Close, Down, Right, Search } from '@/src/icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ROUTER_FLAG, ScreenNavigationProp } from '@/src/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { processData, useProvinceCityArea } from '../map/hooks';
import { CalendarList, LocaleConfig } from 'react-native-calendars';
import { useSearch, useService } from './hooks';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import { useUser } from '@/src/hooks';

export enum CollectedTaskStatusEnum {
  NOT_STARTED = 0,
  NOT_COLLECTED = 1,
  COLLECTED = 2,
  OVERDUE = 3,
}

export const collectedTaskStatusNames = {
  [CollectedTaskStatusEnum.NOT_STARTED]: '未开始',
  [CollectedTaskStatusEnum.NOT_COLLECTED]: '未采集',
  [CollectedTaskStatusEnum.OVERDUE]: '已逾期',
  [CollectedTaskStatusEnum.COLLECTED]: '已采集',
};

export const Collections = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const [searchType, setSearchType] = useState<number | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const { getTasks } = useService();
  const { searchData, updateOwnerUserIdList, updateStatus, updateSearchData } = useSearch();

  const [keyword, setKeyword] = useState('');
  const { user } = useUser();

  useEffect(() => {
    if (user?.shUserId) {
      updateOwnerUserIdList([user?.shUserId as any]);
      updateStatus([1, 3]);
      updateSearchData({ ownerUserIdList: [user?.shUserId as any], statusList: [1, 3] });
    }
  }, [updateOwnerUserIdList, updateSearchData, updateStatus, user?.shUserId]);

  const onSearch = (text?: string) => {
    setKeyword(text || '');
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchTasks = async () => {
        const res = await getTasks({ pageSize: -1, pageNum: 1, ...searchData, taskName: keyword });
        if (isActive) {
          setTasks(res?.result || []);
        }
      };

      fetchTasks();

      return () => {
        isActive = false;
      };
    }, [getTasks, keyword, searchData]),
  );

  return (
    <View backgroundColor="white" className="h-full w-full">
      <SafeAreaView>
        <View className="h-full w-full" style={{ position: 'relative' }}>
          <XStack borderRadius={8} margin={12} alignItems="center" height={44}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Back width={18} height={18} />
            </TouchableOpacity>
            <XStack
              alignItems="center"
              flex={1}
              height="100%"
              marginLeft={12}
              borderRadius={8}
              backgroundColor="#F5F5F5"
            >
              <Search width={16} height={16} color={'#858585'} marginTop={3} marginLeft={14} marginRight={10} />
              <Input
                paddingLeft={0}
                borderWidth={0}
                flex={1}
                value={keyword}
                backgroundColor="transparent"
                placeholder="搜索任务名称"
                onChangeText={(text: string) => {
                  onSearch(text);
                }}
                fontSize={16}
              />
            </XStack>
          </XStack>
          <SearchCondition setSearchType={setSearchType} searchType={searchType} />

          <View flex={1} className="h-full w-full" backgroundColor="#F5F5F5" marginTop={44}>
            {searchType ? (
              <View
                onPress={() => {
                  setSearchType(null);
                  // clear();
                }}
                className="absolute w-full h-full"
                style={{ backgroundColor: 'rgba(0,0,0, 0.3)', zIndex: 2 }}
              />
            ) : null}

            <View padding={12} flex={1}>
              <FlashList
                removeClippedSubviews={Platform.OS === 'android'}
                onEndReachedThreshold={0.3}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                data={tasks}
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
                        navigation.navigate(ROUTER_FLAG.MapCollectionsTaskDetail, {
                          taskId: _item?.id,
                        });
                      }}
                      marginBottom={12}
                    >
                      <XStack justifyContent="space-between" position="relative" flex={1}>
                        <Text fontSize={16} lineHeight={30} fontWeight="bold" color="#141414" maxWidth="80%">
                          {_item?.taskName}
                        </Text>

                        <Text fontSize={14} color="#00BBB4" lineHeight={30}>
                          {_item?.status}
                        </Text>
                      </XStack>
                      <XStack gap={2} marginTop={12} borderRadius={6} backgroundColor="#FAFAFA" padding={12}>
                        <YStack marginRight={20}>
                          <Text fontSize={14} color="#5E5E5E" lineHeight={22}>
                            任务地点
                          </Text>
                          <Text fontSize={14} color="#5E5E5E" lineHeight={22}>
                            负责人
                          </Text>
                          <Text fontSize={14} color="#5E5E5E" lineHeight={22}>
                            开始时间
                          </Text>
                          <Text fontSize={14} color="#5E5E5E" lineHeight={22}>
                            截止时间
                          </Text>
                        </YStack>
                        <YStack flex={1}>
                          <Text fontSize={14} color="#141414" lineHeight={22} numberOfLines={1}>
                            {_item?.address}
                          </Text>
                          <Text fontSize={14} color="#141414" lineHeight={22} numberOfLines={1}>
                            {_item?.ownerUserName}
                          </Text>
                          <Text fontSize={14} color="#141414" lineHeight={22} numberOfLines={1}>
                            {_item?.beginDate}
                          </Text>
                          <Text fontSize={14} color="#141414" lineHeight={22} numberOfLines={1}>
                            {_item?.endDate}
                          </Text>
                        </YStack>
                      </XStack>
                    </View>
                  );
                }}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const SearchConditionMap = [
  { name: '任务状态', key: 1 },
  { name: '负责人', key: 2 },
  { name: '任务位置', key: 3 },
  { name: '时间筛选', key: 4 },
];

const SearchCondition = ({
  searchType,
  setSearchType,
}: {
  setSearchType: React.Dispatch<React.SetStateAction<number | null>>;
  searchType: number | null;
}) => {
  const {
    statusList,
    ownerUserIdList,
    districtCodes,
    cityCodes,
    isNationwide,
    date,
    updateSearchData,
    clear1,
    clear2,
    clear3,
    clear4,
  } = useSearch();
  const openStyles = searchType
    ? {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }
    : {};

  const isColor = (key: number): boolean | string => {
    if (key === 1) {
      return statusList.length > 0;
    }
    if (key === 2) {
      return ownerUserIdList.length > 0;
    }
    if (key === 3) {
      return cityCodes.length > 0 || districtCodes.length > 0;
    }
    if (key === 4) {
      return (
        date.beginDateRange.from || date.endDateRange.from || date.createTimeRange.from || date.completeTimeRange.from
      );
    }
    return false;
  };
  return (
    <YStack
      marginTop={10}
      style={{ position: 'absolute', top: 50, left: 0, right: 0, zIndex: 1 }}
      backgroundColor="white"
    >
      <XGroup {...openStyles}>
        {SearchConditionMap.map((item) => {
          return (
            <XGroup.Item key={item.key}>
              <SearchConditionButton
                isActive={item.key === searchType}
                isColor={isColor(item.key)}
                onPress={() => {
                  setSearchType(searchType === item.key ? null : item.key);
                }}
              >
                {item.name}
              </SearchConditionButton>
            </XGroup.Item>
          );
        })}
      </XGroup>

      {searchType ? (
        <YStack
          marginTop={10}
          borderBottomLeftRadius={12}
          borderBottomRightRadius={12}
          space="$3"
          backgroundColor={searchType === 3 ? '#F5F5F5' : 'white'}
          borderTopColor="#DCDCDC"
          borderTopWidth={1}
          padding={searchType === 3 ? 0 : 12}
        >
          <View flex={1}>
            {searchType === 1 ? <SearchCondition1 /> : null}
            {searchType === 2 ? <SearchCondition2 /> : null}
            {searchType === 3 ? <SearchCondition3 /> : null}
            {searchType === 4 ? <SearchCondition4 /> : null}
            <XStack
              backgroundColor="white"
              className="w-full"
              marginTop={searchType === 3 ? 0 : 12}
              padding={searchType === 3 ? 12 : 0}
            >
              <Button
                variant="outlined"
                borderWidth={1}
                flex={1}
                onPress={() => {
                  if (searchType === 1) {
                    clear1();
                  }
                  if (searchType === 2) {
                    clear2();
                  }
                  if (searchType === 3) {
                    clear3();
                  }
                  if (searchType === 4) {
                    clear4();
                  }

                  // setSearchType(null);
                }}
                marginRight={11}
                fontSize={16}
              >
                重置
              </Button>
              <Button
                backgroundColor="#00BBB4"
                color="white"
                flex={1}
                onPress={() => {
                  updateSearchData({
                    statusList,
                    ownerUserIdList,
                    cityCodes: isNationwide ? [] : cityCodes,
                    districtCodes: isNationwide ? [] : districtCodes,
                    ...date,
                  });
                  setSearchType(null);
                }}
                fontSize={16}
              >
                完成
              </Button>
            </XStack>
          </View>
        </YStack>
      ) : null}
    </YStack>
  );
};

const SearchCondition1 = () => {
  const { statusList, updateStatus } = useSearch();

  const onPress = useCallback(
    (value: number, checked: boolean) => {
      if (checked) {
        updateStatus(statusList.filter((item) => item !== value));
      }
      if (!checked) {
        updateStatus([...statusList, value]);
      }
    },
    [statusList, updateStatus],
  );
  return (
    <YStack>
      <Text color="#141414" fontWeight="500" fontSize={14} marginBottom="$3">
        选择任务状态
      </Text>
      <XStack gap="$3">
        {Object.entries(collectedTaskStatusNames).map(([value, name]) => {
          const checked = statusList?.includes(Number(value));
          return (
            <TouchableOpacity key={value} onPress={() => onPress(Number(value), checked)}>
              <View
                paddingHorizontal={10}
                backgroundColor={checked ? '$primary1Light' : '#FAFAFA'}
                borderColor={checked ? '$primaryLight' : '#FFFFFF'}
                borderWidth={1}
                borderRadius={8}
              >
                <Text textAlign="center" lineHeight={36} color={checked ? '$primaryLight' : '#141414'} fontSize={12}>
                  {name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </XStack>
    </YStack>
  );
};

const SearchCondition2 = () => {
  const { getPlatformUsers } = useService();
  const [users, setUsers] = useState<any[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);

  const { ownerUserIdList, updateOwnerUserIdList } = useSearch();

  const onPress = useCallback(
    (value: string, checked: boolean) => {
      if (checked) {
        updateOwnerUserIdList(ownerUserIdList.filter((item) => item !== value));
      }
      if (!checked) {
        updateOwnerUserIdList([...ownerUserIdList, value]);
      }
    },
    [ownerUserIdList, updateOwnerUserIdList],
  );

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getPlatformUsers({ pageSize: 10, pageNum });
      console.log(res);
      setUsers((prevUsers) => [...prevUsers, ...(res.result || [])]);
      setTotalUsers(res.total || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [getPlatformUsers, pageNum]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleLoadMore = () => {
    setPageNum((prevPageNum) => prevPageNum + 1);
  };

  const hasMoreUsers = users.length < totalUsers;

  return (
    <YStack maxHeight={400}>
      <Text color="#141414" fontWeight="500" fontSize={14} marginBottom="$3">
        负责人
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <XStack gap="$2" flexWrap="wrap">
          {users?.map((item) => {
            const checked = ownerUserIdList?.includes(item?.ownerUserId);
            return (
              <TouchableOpacity key={item.ownerUserId} onPress={() => onPress(item.ownerUserId, checked)}>
                <View
                  paddingHorizontal={10}
                  backgroundColor={checked ? '$primary1Light' : '#FAFAFA'}
                  borderColor={checked ? '$primaryLight' : '#FFFFFF'}
                  borderWidth={1}
                  borderRadius={8}
                >
                  <Text textAlign="center" lineHeight={36} color={checked ? '$primaryLight' : '#141414'} fontSize={12}>
                    {item.ownerUserName}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </XStack>
      </ScrollView>

      {hasMoreUsers && (
        <TouchableOpacity onPress={handleLoadMore} disabled={isLoading}>
          <XStack alignItems="center" justifyContent="flex-end" marginTop={8}>
            <Text fontSize={14} alignContent="center">
              {isLoading ? '加载中...' : '查看更多'}{' '}
              {!isLoading && <Right transform="rotate(90 8 6)" color="#858585" width={10} height={10} />}
            </Text>
          </XStack>
        </TouchableOpacity>
      )}
    </YStack>
  );
};

const SearchCondition3 = () => {
  const { provinceCityArea } = useProvinceCityArea();
  const [province, setProvince] = useState<any[]>([]);
  const [city, setCity] = useState<any[]>([]);
  const [district, setDistrict] = useState<any[]>([]);
  const [{ provinceId, cityId }, setIds] = useState({ provinceId: '', cityId: '', districtId: '' });
  const {
    updateDistrictCodes,
    districtCodes,
    isNationwide,
    updateIsNationwide,
    isCityAll,
    updateIsCityAll,
    updateCityCodes,
  } = useSearch();

  const selectAll = useMemo(() => {
    return (district?.length && districtCodes?.length) === district?.length;
  }, [district, districtCodes]);

  useEffect(() => {
    if (provinceCityArea?.length > 0) {
      setProvince([{ id: 'national', name: '全国' }, ...processData(provinceCityArea, 0)]);
    }
  }, [provinceCityArea]);

  const renderProvinceItem = useCallback(
    ({ item }: any) => {
      const isActive = provinceId === item.id;
      return (
        <TouchableOpacity
          key={item.id}
          style={{
            backgroundColor: isActive ? '#FAFAFA' : '#F5F5F5',
            paddingHorizontal: 20,
            paddingVertical: 16,
            maxWidth: 160,
          }}
          onPress={() => {
            updateIsCityAll(false);
            updateCityCodes([]);
            if (item.id === 'national') {
              setIds({ provinceId: 'national', cityId: '', districtId: '' });
              setCity([{ id: 'national', name: '全国' }]);
              setDistrict([{ id: 'national', name: '全国' }]);
            } else {
              setIds((prevIds) => ({ ...prevIds, provinceId: item.id, cityId: '', districtId: '' }));
              setCity([{ id: 'cityAll', name: '全选' }, ...processData(provinceCityArea, item.id)]);
              setDistrict([]);
            }
          }}
        >
          <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: isActive ? '500' : 'normal', color: '#141414' }}>
            {item?.name}
          </Text>
        </TouchableOpacity>
      );
    },
    [provinceId, updateIsCityAll, updateCityCodes, provinceCityArea],
  );

  const renderCityItem = useCallback(
    ({ item }: any) => {
      const isActive = cityId === item.id;

      const handlePress = (checked: boolean) => {
        if (item.id === 'cityAll') {
          setIds((prevIds) => ({
            ...prevIds,
            cityId: item.id,
            districtId: '',
          }));
          setDistrict([]);
          updateIsCityAll(checked);
          if (checked) {
            updateCityCodes(
              city
                ?.filter((c) => {
                  return c?.id !== 'cityAll' && c?.id !== 'national';
                })
                .map((c) => c?.code) || [],
            );
          } else {
            updateCityCodes([]);
          }
        }
      };
      return (
        <TouchableOpacity
          key={item.id}
          style={{
            backgroundColor: isActive ? 'white' : '#FAFAFA',
            paddingHorizontal: 20,
            paddingVertical: 16,
            maxWidth: 160,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            if (item.id === 'national') {
              setIds((prevIds) => ({ ...prevIds, cityId: '', districtId: '' }));
              setDistrict([{ id: 'national', name: '全国' }]);
            } else {
              setDistrict(processData(provinceCityArea, item.id));
              setIds((prevIds) => ({
                ...prevIds,
                cityId: item.id,
                districtId: '',
              }));
            }
          }}
        >
          <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: isActive ? '500' : 'normal', color: '#141414' }}>
            {item?.name}
          </Text>
          {item.id === 'cityAll' ? (
            <Checkbox
              size="$4"
              marginLeft={8}
              checked={isCityAll || false}
              backgroundColor="$white"
              onCheckedChange={(checked: boolean) => {
                handlePress(checked);
              }}
            >
              <Checkbox.Indicator borderRadius={3} style={{ backgroundColor: '#00BBB4', width: 20, height: 20 }}>
                <Check color="#fff" width={20} height={20} />
              </Checkbox.Indicator>
            </Checkbox>
          ) : null}
        </TouchableOpacity>
      );
    },
    [city, cityId, isCityAll, provinceCityArea, updateCityCodes, updateIsCityAll],
  );

  const toggleSelectAll = () => {
    if (selectAll) {
      updateDistrictCodes([]);
    } else {
      updateDistrictCodes(district?.map((item) => item.id) || []);
    }
    updateIsNationwide(false);
  };

  const renderDistrictItem = useCallback(
    ({ item }: any) => {
      const isActive = provinceId === 'national' ? isNationwide : districtCodes?.includes(item.id);

      const handlePress = (checked: boolean) => {
        if (provinceId === 'national') {
          updateIsNationwide(checked);
          return;
        }
        if (checked) {
          updateDistrictCodes([...districtCodes, item.id]);
        } else {
          updateDistrictCodes(districtCodes.filter((code) => code !== item.id));
        }
      };

      return (
        <TouchableOpacity
          key={item.id}
          style={{
            backgroundColor: 'white',
            paddingHorizontal: 20,
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
            maxWidth: 160,
          }}
          onPress={() => handlePress(!isActive)}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: isActive ? '500' : 'normal',
              color: isActive ? '#00BBB4' : '#141414',
              marginRight: 8,
              flexShrink: 1,
            }}
            numberOfLines={1}
          >
            {item?.name}
          </Text>
          <View style={{ flex: 1 }} />
          <Checkbox
            size="$4"
            checked={isActive || false}
            backgroundColor="$white"
            onCheckedChange={(checked: boolean) => handlePress(checked)}
          >
            <Checkbox.Indicator borderRadius={3} style={{ backgroundColor: '#00BBB4', width: 20, height: 20 }}>
              <Check color="#fff" width={20} height={20} />
            </Checkbox.Indicator>
          </Checkbox>
        </TouchableOpacity>
      );
    },
    [districtCodes, isNationwide, provinceId, updateDistrictCodes, updateIsNationwide],
  );

  return (
    <XStack maxHeight={400} flexGrow={3}>
      <View flex={1}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={province}
          renderItem={renderProvinceItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      <View flex={1}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={city}
          renderItem={renderCityItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      <View flex={1}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={district}
          renderItem={renderDistrictItem}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={() => {
            return district?.length && provinceId !== 'national' ? (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  backgroundColor: '#ffffff',
                }}
                onPress={() => {
                  toggleSelectAll();
                }}
              >
                <Text style={{ fontSize: 14, marginRight: 8, color: selectAll ? '#00BBB4' : '#141414' }}>全选</Text>
                <View style={{ flex: 1 }} />
                <Checkbox
                  size="$4"
                  checked={selectAll}
                  backgroundColor="$white"
                  onCheckedChange={() => toggleSelectAll()}
                >
                  <Checkbox.Indicator borderRadius={3} style={{ backgroundColor: '#00BBB4', width: 20, height: 20 }}>
                    <Check color="#fff" width={20} height={20} />
                  </Checkbox.Indicator>
                </Checkbox>
              </TouchableOpacity>
            ) : null;
          }}
        />
      </View>
    </XStack>
  );
};

LocaleConfig.locales.cn = {
  monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
  today: '今天',
};
LocaleConfig.defaultLocale = 'cn';

const SearchConditionDate = [
  {
    name: '开始时间',
    keyof: 'beginDateRange',
  },
  {
    name: '截止时间',
    keyof: 'endDateRange',
  },
  {
    name: '创建时间',
    keyof: 'createTimeRange',
  },
  {
    name: '完成时间',
    keyof: 'completeTimeRange',
  },
];
const SearchCondition4 = () => {
  const { date, updateDate, checkedState, setCheckedState } = useSearch();
  const [sheetOpen, setSheetOpen] = useState(false);
  // const [checkedState, setCheckedState] = useState<{
  //   [key: string]: { week: boolean; month: boolean; custom: boolean };
  // }>({
  //   beginDateRange: { week: false, month: false, custom: false },
  //   endDateRange: { week: false, month: false, custom: false },
  //   createTimeRange: { week: false, month: false, custom: false },
  //   completeTimeRange: { week: false, month: false, custom: false },
  // });
  const [keyOf, setKeyOf] = useState<string>('');

  const onWeekPress = useCallback(
    (keyof: string, checked: boolean) => {
      setCheckedState({
        ...checkedState,
        [keyof]: { week: !checked, month: false, custom: false },
      });
      if (checked) {
        updateDate({
          ...date,
          [keyof]: {
            from: '',
            to: '',
          },
        });
      } else {
        updateDate({
          ...date,
          [keyof]: {
            from: moment().startOf('week').format('YYYY-MM-DD 00:00:00'),
            to: moment().endOf('week').format('YYYY-MM-DD 23:59:59'),
          },
        });
      }
    },
    [checkedState, date, setCheckedState, updateDate],
  );

  const onMonthPress = useCallback(
    (keyof: string, checked: boolean) => {
      setCheckedState({
        ...checkedState,
        [keyof]: { week: false, month: !checked, custom: false },
      });
      if (checked) {
        updateDate({
          ...date,
          [keyof]: {
            from: '',
            to: '',
          },
        });
      } else {
        updateDate({
          ...date,
          [keyof]: {
            from: moment().startOf('month').format('YYYY-MM-DD 00:00:00'),
            to: moment().endOf('month').format('YYYY-MM-DD 23:59:59'),
          },
        });
      }
    },
    [checkedState, date, setCheckedState, updateDate],
  );

  const onCustomPress = useCallback((_keyof: string) => {
    setSheetOpen(true);
    setKeyOf(_keyof);
  }, []);

  const onConfirm = useCallback(
    (startDate: string | null, endDate: string | null) => {
      if (startDate && endDate) {
        setCheckedState({ ...checkedState, [keyOf]: { week: false, month: false, custom: true } });
        updateDate({
          ...date,
          [keyOf]: {
            from: startDate,
            to: endDate,
          },
        });
      }

      setSheetOpen(false);
    },
    [checkedState, date, keyOf, setCheckedState, updateDate],
  );

  return (
    <YStack>
      {SearchConditionDate.map((item) => {
        const { week, month, custom } = checkedState[item.keyof];
        const { from = '', to = '' } = date[item.keyof];

        // const isCustom = from && to;
        return (
          <YStack key={item.keyof}>
            <Text color="#141414" fontWeight="500" fontSize={14} marginBottom={8}>
              {item.name}
            </Text>
            <XStack gap="$2" flexWrap="wrap" marginBottom={16}>
              <TouchableOpacity onPress={() => onWeekPress(item.keyof, week)}>
                <View
                  paddingHorizontal={10}
                  backgroundColor={week ? '$primary1Light' : '#FAFAFA'}
                  borderColor={week ? '$primaryLight' : '#FFFFFF'}
                  borderWidth={1}
                  borderRadius={8}
                >
                  <Text textAlign="center" lineHeight={36} color={week ? '$primaryLight' : '#141414'} fontSize={12}>
                    本周
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onMonthPress(item.keyof, month)}>
                <View
                  paddingHorizontal={10}
                  backgroundColor={month ? '$primary1Light' : '#FAFAFA'}
                  borderColor={month ? '$primaryLight' : '#FFFFFF'}
                  borderWidth={1}
                  borderRadius={8}
                >
                  <Text textAlign="center" lineHeight={36} color={month ? '$primaryLight' : '#141414'} fontSize={12}>
                    本月
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onCustomPress(item.keyof)}>
                <View
                  paddingHorizontal={10}
                  backgroundColor={custom ? '$primary1Light' : '#FAFAFA'}
                  borderColor={custom ? '$primaryLight' : '#FFFFFF'}
                  borderWidth={1}
                  borderRadius={8}
                >
                  <Text textAlign="center" lineHeight={36} color={custom ? '$primaryLight' : '#141414'} fontSize={12}>
                    {custom ? `${from} - ${to}` : '自定义'}
                  </Text>
                </View>
              </TouchableOpacity>
            </XStack>
          </YStack>
        );
      })}
      {sheetOpen ? (
        <CalendarSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          onConfirm={onConfirm}
          startDate={date[keyOf].from}
          endDate={date[keyOf].to}
        />
      ) : null}
    </YStack>
  );
};

export const CalendarSheet = (
  props: SheetProps & {
    onConfirm: (startDate: string | null, endDate: string | null) => void;
    startDate: string;
    endDate: string;
  },
) => {
  const [startDate, setStartDate] = useState(props.startDate ? moment(props.startDate).format('YYYY-MM-DD') : '');
  const [endDate, setEndDate] = useState(props.endDate ? moment(props.endDate).format('YYYY-MM-DD') : '');

  const onDayPress = useCallback(
    (day: any) => {
      if (!startDate) {
        setStartDate(day.dateString);
      } else if (startDate && !endDate) {
        if (moment(day.dateString).isBefore(startDate)) {
          setEndDate(startDate);
          setStartDate(day.dateString);
        } else {
          setEndDate(day.dateString);
        }
      } else {
        setStartDate(day.dateString);
        setEndDate('');
      }
    },
    [startDate, endDate],
  );

  const marked = useMemo(() => {
    let markedDates: any = {};
    if (startDate) {
      markedDates[startDate] = {
        selected: true,
        startingDay: true,
        color: '#00BBB4',
        textColor: 'white',
        customStyles: {
          container: {
            borderRadius: 'none',
          },
        },
      };
    }
    if (endDate) {
      markedDates[endDate] = {
        selected: true,
        endingDay: true,
        color: '#00BBB4',
        textColor: 'white',
        customStyles: {
          container: {
            borderRadius: 'none',
          },
        },
      };
    }
    if (startDate && endDate) {
      let current = moment(startDate).add(1, 'day');
      const end = moment(endDate);
      while (current.isBefore(end)) {
        markedDates[current.format('YYYY-MM-DD')] = {
          selected: true,
          color: '#F2FBFB',
          textColor: '#000000',
        };
        current = current.add(1, 'day');
      }
    }
    return markedDates;
  }, [startDate, endDate]);

  const theme = {
    todayTextColor: '#00BBB4',
    todayTextWeight: 'bold',
  };

  return (
    <Sheet
      dismissOnOverlayPress
      animation="medium"
      modal
      snapPoints={[70]}
      native
      disableDrag
      open={props.open}
      onOpenChange={props.onOpenChange}
    >
      <Sheet.Overlay animation="medium" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Frame flex={1} backgroundColor="$white">
        <XStack marginBottom={30}>
          <Text
            className="text-base font-medium"
            textAlign="center"
            style={{ color: '#141414', position: 'absolute', top: 16, left: '50%', transform: [{ translateX: -50 }] }}
          >
            自定义时间
          </Text>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            onPress={() => {
              props.onOpenChange?.(false);
            }}
            style={{ position: 'absolute', right: 16, top: 16 }}
          >
            <Close color="#000000" />
          </TouchableOpacity>
        </XStack>
        <View flex={1} marginTop={30}>
          <CalendarList markingType="period" theme={theme} onDayPress={onDayPress} markedDates={marked} />
        </View>
        <YStack marginBottom={8} marginTop={10} padding={16}>
          <Button
            backgroundColor="#00BBB4"
            color="white"
            onPress={() => {
              props.onConfirm(
                startDate ? moment(startDate).startOf('day').format('YYYY-MM-DD 00:00:00') : null,
                endDate ? moment(endDate).endOf('day').format('YYYY-MM-DD 23:59:59') : null,
              );
            }}
          >
            确定
          </Button>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};

const SearchConditionButton = ({
  isActive,
  isColor,
  ...rest
}: { isActive: boolean; isColor: boolean | string } & ButtonProps) => {
  const openIconStyles = isActive
    ? {
        transform: [{ rotate: '180deg' }],
      }
    : {};

  return (
    <Button
      iconAfter={<Down color={isActive || isColor ? '#00BBB4' : '#141414'} style={isActive ? openIconStyles : {}} />}
      backgroundColor="white"
      size="$2.5"
      color={isActive || isColor ? '#00BBB4' : '#141414'}
      flexGrow={1}
      {...rest}
    />
  );
};
