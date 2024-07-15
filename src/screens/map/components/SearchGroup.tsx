import { Check, Down, Right, Search } from '@/src/icons';
import { Separator, XGroup, Button, YStack, Text, XStack, Input, ListItem, View, Checkbox, Label } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { ROUTER_FLAG, ScreenNavigationProp } from '@/src/navigation';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Tag } from './Tag';
import { Colors } from './Colors';
import {
  processData,
  useGroupList,
  usePoiList,
  usePointCount,
  useProvinceCityArea,
  useSearch,
  useSearchField,
  useShowConfig,
} from '../hooks';
import { Breadcrumb } from '@/src/components';
import { Creators } from './Creators';
import { ScrollView } from 'react-native-gesture-handler';
import { debounce } from 'lodash-es';
import { SearchType } from '@/src/interfaces/map';

export const SearchGroup = (props: {
  left?: number;
  right?: number;
  top?: number | string;
  zIndex?: number;
  onUpdate: () => void;
}) => {
  const { left = 12, right = 12, top = '9%', zIndex = 26 } = props;
  const navigation = useNavigation<ScreenNavigationProp>();
  const { searchType, setSearchType } = useSearch();
  const isPosition = searchType === 'position' || searchType === 'group';
  const isShop = searchType === 'shop' || searchType === 'shopArea';
  const isPoi = searchType === 'poi' || searchType === 'poiArea';
  const { counts, showCount }: any = usePointCount();

  const openStyles = searchType
    ? {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }
    : {};
  const openIconStyles = searchType
    ? {
        transform: [{ rotate: '180deg' }],
      }
    : {};

  const handlePress = (_searchType: SearchType) => {
    setSearchType(searchType ? null : _searchType);
  };
  return (
    <View style={{ position: 'absolute', top: top, left: left, right: right, zIndex: zIndex }}>
      <YStack>
        <XGroup
          height="$3.5"
          backgroundColor="white"
          alignItems="center"
          alignContent="center"
          borderRadius={12}
          paddingRight={24}
          {...openStyles}
        >
          <XGroup.Item>
            <Button
              size="$2.5"
              icon={
                <XStack>
                  <Search width={16} height={16} color={'#141414'} marginTop={3} />
                  <Separator height={12} alignSelf="stretch" vertical marginLeft="$3" />
                </XStack>
              }
              backgroundColor="white"
              onPress={() => {
                navigation.navigate(ROUTER_FLAG.MapSearch);
              }}
            />
          </XGroup.Item>
          <XGroup.Item>
            <Button
              iconAfter={<Down color={isPosition ? '#00BBB4' : '#141414'} style={isPosition ? openIconStyles : {}} />}
              backgroundColor="white"
              color={isPosition ? '#00BBB4' : '#141414'}
              size="$2.5"
              flexGrow={1}
              onPress={() => {
                handlePress('position');
              }}
            >
              钉图 {String(counts?.mapPositionCount) && showCount?.position ? `(${counts?.mapPositionCount})` : ''}
            </Button>
          </XGroup.Item>
          <XGroup.Item>
            <Button
              iconAfter={<Down color={isShop ? '#00BBB4' : '#141414'} style={isShop ? openIconStyles : {}} />}
              backgroundColor="white"
              size="$2.5"
              color={isShop ? '#00BBB4' : '#141414'}
              flexGrow={1}
              onPress={() => {
                setSearchType(searchType ? null : 'shop');
              }}
            >
              门店 {String(counts?.shopPositionCount) && showCount?.shop ? `(${counts?.shopPositionCount})` : ''}
            </Button>
          </XGroup.Item>
          <XGroup.Item>
            <Button
              iconAfter={<Down color={isPoi ? '#00BBB4' : '#141414'} style={isPoi ? openIconStyles : {}} />}
              backgroundColor="white"
              size="$2.5"
              color={isPoi ? '#00BBB4' : '#141414'}
              onPress={() => {
                setSearchType(searchType ? null : 'poi');
              }}
              flexGrow={1}
            >
              POI {String(counts?.poiPositionCount) && showCount?.poi ? `(${counts?.poiPositionCount})` : ''}
            </Button>
          </XGroup.Item>
          {/* <XGroup.Item>
            <Button
              iconAfter={<Down color={isMore ? '#00BBB4' : '#141414'} style={isMore ? openIconStyles : {}} />}
              backgroundColor="white"
              size="$2.5"
              color={isMore ? '#00BBB4' : '#141414'}
              onPress={() => {
                setSearchType(searchType ? null : 'more');
              }}
              flexGrow={1}
            >
              更多
            </Button>
          </XGroup.Item> */}
        </XGroup>

        {searchType ? (
          <SearchContent onUpdate={props?.onUpdate} searchType={searchType} setSearchType={setSearchType as any} />
        ) : null}
      </YStack>
    </View>
  );
};

const SearchContent = ({
  searchType,
  setSearchType,
  onUpdate,
}: {
  searchType: SearchType;
  onUpdate: () => void;
  setSearchType: React.Dispatch<React.SetStateAction<SearchType>>;
}) => {
  const { detail, setDetail } = useSearch();
  const { showCount, setShowCount }: any = usePointCount();
  const {
    config: { isShowAdministrative },
  } = useShowConfig();
  const [searchData, setSearchData] = useState<any>({
    position: {
      colors: [],
      groupInfo: [],
      creators: [],
      conditions: {},
      positionStatusList: [],
    },
    shopPositionRequest: {
      creators: [],
      colors: [],
      conditions: {},
      area: [],
      shopStatusList: [],
      shopNatures: [],
      shopTypes: [],
    },
    poiPositionRequest: {
      area: [],
      poiIdList: [],
    },
  });

  useEffect(() => {
    if (detail) {
      setSearchData(detail);
    }
  }, [detail]);

  return (
    <YStack
      borderBottomLeftRadius={12}
      borderBottomRightRadius={12}
      space="$3"
      backgroundColor="white"
      borderTopColor="#DCDCDC"
      borderTopWidth={1}
      padding={12}
      maxHeight={500}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {searchType === 'position' ? (
          <PositionComponent setSearchType={setSearchType} searchData={searchData} setSearchData={setSearchData} />
        ) : null}
        {searchType === 'group' ? (
          <GroupComponent groupInfo={searchData?.position?.groupInfo} setSearchData={setSearchData} />
        ) : null}
        {searchType === 'shopArea' ? (
          <AreaComponent area={searchData?.shopPositionRequest?.area} type="shop" setSearchData={setSearchData} />
        ) : null}
        {searchType === 'poiArea' ? (
          <AreaComponent area={searchData?.poiPositionRequest?.area} type="poi" setSearchData={setSearchData} />
        ) : null}
        {searchType === 'shop' ? (
          <ShopComponent setSearchType={setSearchType} searchData={searchData} setSearchData={setSearchData} />
        ) : null}
        {searchType === 'poi' ? (
          <PoiComponent setSearchType={setSearchType} searchData={searchData} setSearchData={setSearchData} />
        ) : null}
      </ScrollView>
      <XStack>
        <Button
          variant="outlined"
          borderWidth={1}
          flex={1}
          onPress={() => {
            if (searchType === 'shop') {
              setDetail({ ...detail, shopPositionRequest: {} });
              setSearchData({ ...detail, shopPositionRequest: {} });
              setShowCount({ ...showCount, shop: false });
            }
            if (searchType === 'poi') {
              setDetail({ ...detail, poiPositionRequest: {} });
              setSearchData({ ...detail, poiPositionRequest: {} });
              setShowCount({ ...showCount, poi: false });
            }
            if (searchType === 'position') {
              setDetail({ ...detail, position: {} });
              setSearchData({ ...detail, position: {} });
              setShowCount({ ...showCount, position: false });
            }
            setSearchType(null);
            if (isShowAdministrative) {
              onUpdate();
            }
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
            // setSearchDetail({ ...detail, groupInfo, colors, creators, conditions });
            if (searchType === 'group') {
              setSearchType('position');
              return;
            }
            if (searchType === 'shopArea') {
              setSearchType('shop');
              return;
            }
            if (searchType === 'poiArea') {
              setSearchType('poi');
              return;
            }
            if (searchType === 'shop') {
              setDetail({ ...detail, shopPositionRequest: searchData?.shopPositionRequest });
              setShowCount({ ...showCount, shop: true });
            }
            if (searchType === 'poi') {
              setDetail({ ...detail, poiPositionRequest: searchData?.poiPositionRequest });
              setShowCount({ ...showCount, poi: true });
            }
            if (searchType === 'position') {
              setDetail({ ...detail, position: searchData?.position });
              setShowCount({ ...showCount, position: true });
            }
            setSearchType(null);
            if (isShowAdministrative) {
              onUpdate();
            }
          }}
          fontSize={16}
        >
          完成
        </Button>
      </XStack>
    </YStack>
  );
};

const PoiComponent = ({ searchData, setSearchData, setSearchType }: any) => {
  const { poiPositionRequest = {} } = searchData;
  const { poiIdList = [], area = [] } = poiPositionRequest;
  const { poiList } = usePoiList();
  return (
    <YStack gap="$4">
      <YStack>
        <XStack justifyContent="space-between">
          <Text color="#141414" fontWeight="500" fontSize={14} marginBottom="$3">
            区域
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSearchType('poiArea');
            }}
          >
            <Text color="#00BBB4" fontWeight="500" fontSize={14}>
              {area?.length > 0 ? '重新选择' : ' 全部区域'}

              <Right color="#00BBB4" width={12} height={12} />
            </Text>
          </TouchableOpacity>
        </XStack>
        {area?.length ? (
          <XStack space="$2" alignItems="center">
            <Text>已选</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <XStack space="$2">
                {poiPositionRequest?.area?.map((group: any) => {
                  return <Tag key={group?.id}>{group?.name}</Tag>;
                })}
              </XStack>
            </ScrollView>
          </XStack>
        ) : null}
      </YStack>

      <YStack space="$2">
        <Text color="#141414" fontWeight="500" fontSize={14} marginBottom="$3">
          关键词
        </Text>
        <XStack space="$2" flexWrap="wrap">
          {poiList?.map(({ brandName, id }: any, index: number) => {
            const checked = poiIdList?.includes(id);

            return (
              <Button
                key={`${id}-${index}`}
                height={32}
                noTextWrap
                marginBottom={8}
                backgroundColor={checked ? '$primary1Light' : '#FAFAFA'}
                color={checked ? '$primaryLight' : '#141414'}
                borderColor={checked ? '$primaryLight' : '#FFFFFF'}
                onPress={() => {
                  if (checked) {
                    setSearchData((prevData: any) => ({
                      ...prevData,
                      poiPositionRequest: {
                        ...prevData?.poiPositionRequest,
                        poiIdList: prevData?.poiPositionRequest?.poiIdList?.filter((item: any) => item !== id),
                      },
                    }));
                  } else {
                    setSearchData((prevData: any) => ({
                      ...prevData,
                      poiPositionRequest: {
                        ...prevData?.poiPositionRequest,
                        poiIdList: [...poiIdList, id],
                      },
                    }));
                  }
                }}
              >
                <Text fontSize={12} numberOfLines={1}>
                  {brandName}
                </Text>
              </Button>
            );
          })}
        </XStack>
      </YStack>
      <MoreComponent type="poi" conditions={poiPositionRequest?.conditions} setSearchData={setSearchData} />
    </YStack>
  );
};

const PositionComponent = ({ searchData, setSearchData, setSearchType }: any) => {
  const { position = {} } = searchData;

  return (
    <YStack gap="$4">
      <YStack>
        <XStack justifyContent="space-between">
          <Text color="#141414" fontWeight="500" fontSize={14} marginBottom="$3">
            分组
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSearchType('group');
            }}
          >
            <Text color="#00BBB4" fontWeight="500" fontSize={14}>
              {position?.groupInfo?.length > 0 ? '重新选择' : ' 全部分组'}

              <Right color="#00BBB4" width={12} height={12} />
            </Text>
          </TouchableOpacity>
        </XStack>
        {position?.groupInfo?.length ? (
          <XStack space="$2" alignItems="center">
            <Text>已选</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <XStack space="$2">
                {position?.groupInfo?.map((group: any) => {
                  return <Tag key={group?.id}>{group?.name}</Tag>;
                })}
              </XStack>
            </ScrollView>
          </XStack>
        ) : null}
      </YStack>
      <YStack>
        <Text color="#141414" fontWeight="500" fontSize={14} marginBottom="$3">
          颜色
        </Text>
        <Colors
          value={position?.colors ?? []}
          onChange={(v) => {
            setSearchData((_prev: any) => ({
              ..._prev,
              position: { ..._prev?.position, colors: v },
            }));
          }}
        />
      </YStack>
      <YStack>
        <Text color="#141414" fontWeight="500" fontSize={14} marginBottom="$3">
          创建人
        </Text>
        <Creators creators={position?.creators} type="position" setSearchData={setSearchData} />
      </YStack>
      <MoreComponent type="position" conditions={position?.conditions} setSearchData={setSearchData} />
    </YStack>
  );
};

const ShopComponent = ({ searchData, setSearchData, setSearchType }: any) => {
  const { shopPositionRequest = {} } = searchData;
  const { area = [] } = shopPositionRequest;
  return (
    <YStack gap="$4">
      <YStack>
        <XStack justifyContent="space-between">
          <Text color="#141414" fontWeight="500" fontSize={14} marginBottom="$3">
            区域
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSearchType('shopArea');
            }}
          >
            <Text color="#00BBB4" fontWeight="500" fontSize={14}>
              {area?.length > 0 ? '重新选择' : ' 全部区域'}

              <Right color="#00BBB4" width={12} height={12} />
            </Text>
          </TouchableOpacity>
        </XStack>
        {area?.length ? (
          <XStack space="$2" alignItems="center">
            <Text>已选</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <XStack space="$2">
                {shopPositionRequest?.area?.map((group: any) => {
                  return <Tag key={group?.id}>{group?.name}</Tag>;
                })}
              </XStack>
            </ScrollView>
          </XStack>
        ) : null}
      </YStack>
      <YStack>
        <Text color="#141414" fontWeight="500" fontSize={14} marginBottom="$3">
          颜色
        </Text>
        <Colors
          value={shopPositionRequest?.colors ?? []}
          onChange={(v) => {
            setSearchData((_prev: any) => ({
              ..._prev,
              shopPositionRequest: { ..._prev?.shopPositionRequest, colors: v },
            }));
          }}
        />
      </YStack>
      <YStack>
        <Text color="#141414" fontWeight="500" fontSize={14} marginBottom="$3">
          创建人
        </Text>
        <Creators creators={shopPositionRequest?.creators} type="shop" setSearchData={setSearchData} />
      </YStack>
      <MoreComponent conditions={shopPositionRequest?.conditions} setSearchData={setSearchData} type="shop" />
    </YStack>
  );
};

const AreaComponent = ({
  type,
  area = [],
  setSearchData,
}: {
  type: 'shop' | 'poi';
  area: any[];
  setSearchData: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: number | null; name: string }[]>([{ id: 0, name: '列表' }]);
  const { provinceCityArea } = useProvinceCityArea();
  const [areaId, setAreaId] = useState(0);
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    if (provinceCityArea?.length > 0) {
      setList(processData(provinceCityArea, areaId));
    }
  }, [areaId, provinceCityArea]);

  const debounceOnPress = (group: any, checked: boolean) => {
    if (group?.level !== 3) {
      setAreaId(group?.id);
      setBreadcrumbs((prev) => [...prev, { id: group?.id, name: group?.name }]);
    } else {
      if (checked) {
        if (type === 'shop') {
          setSearchData((_prev: any) => ({
            ..._prev,
            shopPositionRequest: {
              ..._prev?.shopPositionRequest,
              area: _prev?.shopPositionRequest?.area?.filter(({ id }: any) => id !== group?.id),
            },
          }));
        }
        if (type === 'poi') {
          setSearchData((_prev: any) => ({
            ..._prev,
            poiPositionRequest: {
              ..._prev?.poiPositionRequest,
              area: _prev?.poiPositionRequest?.area?.filter(({ id }: any) => id !== group?.id),
            },
          }));
        }
      } else {
        if (type === 'shop') {
          setSearchData((_prev: any) => ({
            ..._prev,
            shopPositionRequest: {
              ..._prev?.shopPositionRequest,
              area: [...area, group],
            },
          }));
        }
        if (type === 'poi') {
          setSearchData((_prev: any) => ({
            ..._prev,
            poiPositionRequest: {
              ..._prev?.poiPositionRequest,
              area: [...area, group],
            },
          }));
        }
      }
    }
  };

  const checkboxDebounceOnPress = (group: any, checked: boolean) => {
    if (checked) {
      if (type === 'shop') {
        setSearchData((_prev: any) => ({
          ..._prev,
          shopPositionRequest: {
            ..._prev?.shopPositionRequest,
            area: [...area, group],
          },
        }));
      }
      if (type === 'poi') {
        setSearchData((_prev: any) => ({
          ..._prev,
          poiPositionRequest: {
            ..._prev?.poiPositionRequest,
            area: [...area, group],
          },
        }));
      }
    } else {
      if (type === 'shop') {
        setSearchData((_prev: any) => ({
          ..._prev,
          shopPositionRequest: {
            ..._prev?.shopPositionRequest,
            area: _prev?.shopPositionRequest?.area?.filter(({ id }: any) => id !== group?.id),
          },
        }));
      }
      if (type === 'poi') {
        setSearchData((_prev: any) => ({
          ..._prev,
          poiPositionRequest: {
            ..._prev?.poiPositionRequest,
            area: _prev?.poiPositionRequest?.area?.filter(({ id }: any) => id !== group?.id),
          },
        }));
      }
    }
  };
  return (
    <View flex={1} minHeight={700}>
      <Text color="#141414" fontWeight="500" fontSize={14}>
        区域
      </Text>
      <YStack space="$3" marginTop="$3">
        <Breadcrumb className="bg-white p-0">
          {breadcrumbs.map(({ name, id }: any) => (
            <Breadcrumb.Item
              onPress={() => {
                const index = breadcrumbs.findIndex((item) => item.id === id);
                setBreadcrumbs((prev) => prev.slice(0, index + 1));
                setAreaId(id);
              }}
              key={`${name}-${id}`}
            >
              {name}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
        <ScrollView style={{ maxHeight: 350, marginLeft: 12 }} showsVerticalScrollIndicator={false}>
          <YStack space="$2" flex={1}>
            {list?.map((group: any) => {
              const checked = area?.find(({ id }: any) => id === group?.id) ? true : false;
              return (
                <TouchableOpacity
                  key={group?.id}
                  onPress={() => {
                    debounceOnPress(group, checked);
                  }}
                >
                  <XStack space="$4" alignItems="center">
                    <Checkbox
                      size="$4"
                      checked={checked}
                      value={group?.id}
                      backgroundColor="$white"
                      onCheckedChange={(_checked: boolean) => {
                        checkboxDebounceOnPress(group, _checked);
                      }}
                    >
                      <Checkbox.Indicator
                        borderRadius={3}
                        style={{ backgroundColor: '#00BBB4', width: '20px', height: '20px' }}
                      >
                        <Check color="#fff" width="20px" height="20px" />
                      </Checkbox.Indicator>
                    </Checkbox>
                    <ListItem
                      flex={1}
                      iconAfter={group?.level === 3 ? null : <Right color="#B8B8B8" />}
                      paddingBottom="$4"
                      backgroundColor="#fff"
                      borderBottomWidth={1}
                      padding={0}
                    >
                      <XStack alignItems="center">
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={{ fontWeight: 400, fontSize: 16, marginRight: 8, width: '75%' }}
                        >
                          {group?.name}
                        </Text>
                        {/* <Text>{`(${group?.positionNum})`}</Text> */}
                      </XStack>
                    </ListItem>
                  </XStack>
                </TouchableOpacity>
              );
            })}
          </YStack>
        </ScrollView>

        {/* <TouchableOpacity onPress={() => setCreateGroupSheetOpen(true)}>
          <XStack space="$3" borderRadius={8} alignItems="center">
            <AddGroup />
            <Text>创建分组</Text>
          </XStack>
        </TouchableOpacity> */}
      </YStack>
      {/* {createGroupSheetOpen ? (
        <CreateGroupSheet open={createGroupSheetOpen} onOpenChange={setCreateGroupSheetOpen} addGroup={addGroup} />
      ) : null} */}
    </View>
  );
};

const GroupComponent = ({
  groupInfo,
  setSearchData,
}: {
  groupInfo: any[];
  setSearchData: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const [inputValue, setInputValue] = useState('');
  const [groupId, setGroupId] = useState<string | null>(null);

  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string | null; name: string }[]>([{ id: null, name: '列表' }]);
  const { list, getGroupList } = useGroupList();

  const debounceOnPress = debounce((group, checked: boolean) => {
    if (group?.hasChild) {
      setGroupId(group?.id);
      getGroupList({ parentId: group?.id });
      setBreadcrumbs((prev) => [...prev, { id: group?.id, name: group?.name }]);
    } else {
      if (checked) {
        setSearchData((_prev: any) => ({
          ..._prev,
          position: {
            ..._prev?.position,
            groupInfo: _prev?.position?.groupInfo?.filter(({ id }: any) => id !== group?.id),
          },
        }));
      } else {
        setSearchData((_prev: any) => {
          return {
            ..._prev,
            position: {
              ..._prev?.position,
              groupInfo: [..._prev?.position?.groupInfo, group],
            },
          };
        });
      }
    }
  }, 1000);

  const checkboxDebounceOnPress = debounce((group, checked: boolean) => {
    if (checked) {
      setSearchData((_prev: any) => ({
        ..._prev,
        position: {
          ..._prev?.position,
          groupInfo: [..._prev?.position?.groupInfo, group],
        },
      }));
    } else {
      setSearchData((_prev: any) => ({
        ..._prev,
        position: {
          ..._prev?.position,
          groupInfo: _prev?.position?.groupInfo?.filter(({ id }: any) => id !== group?.id),
        },
      }));
    }
  }, 1000);

  return (
    <View flex={1}>
      <Text color="#141414" fontWeight="500" fontSize={14}>
        分组
      </Text>
      <YStack space="$3">
        <XStack backgroundColor="#F5F5F5" marginTop={12} borderRadius={8} alignItems="center" paddingLeft="$3">
          <Search width={16} height={16} />
          <Input
            paddingLeft={8}
            borderWidth={0}
            value={inputValue}
            placeholder="搜索分组名称"
            onChangeText={(text) => {
              setInputValue(text);
              getGroupList({ groupName: text, parentId: groupId });
            }}
          />
        </XStack>
        <Breadcrumb className="bg-white p-0">
          {breadcrumbs.map(({ name, id }) => (
            <Breadcrumb.Item
              onPress={() => {
                const index = breadcrumbs.findIndex((item) => item.id === id);
                setBreadcrumbs((prev) => prev.slice(0, index + 1));
                getGroupList({ parentId: id as string });
                setGroupId(id);
              }}
              key={`${name}-${id}`}
            >
              {name}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
        {/* <ScrollView style={{ maxHeight: 150, marginLeft: 12 }} showsVerticalScrollIndicator={false}> */}
        <YStack space="$2" flex={1}>
          {list?.map((group: any) => {
            const checked = groupInfo?.find(({ id }: any) => id === group?.id) ? true : false;
            return (
              <TouchableOpacity
                key={group?.id}
                onPress={() => {
                  debounceOnPress(group, checked);
                }}
              >
                <XStack space="$4" alignItems="center">
                  <Checkbox
                    size="$4"
                    checked={checked}
                    value={group?.id}
                    backgroundColor="$white"
                    onCheckedChange={(_checked: boolean) => {
                      checkboxDebounceOnPress(group, _checked);
                    }}
                  >
                    <Checkbox.Indicator
                      borderRadius={3}
                      style={{ backgroundColor: '#00BBB4', width: '20px', height: '20px' }}
                    >
                      <Check color="#fff" width="20px" height="20px" />
                    </Checkbox.Indicator>
                  </Checkbox>
                  <ListItem
                    flex={1}
                    iconAfter={group?.hasChild ? <Right color="#B8B8B8" /> : null}
                    paddingBottom="$4"
                    backgroundColor="#fff"
                    borderBottomWidth={1}
                    padding={0}
                  >
                    <XStack alignItems="center">
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{ fontWeight: 400, fontSize: 16, marginRight: 8, maxWidth: '75%' }}
                      >
                        {group?.name}
                      </Text>
                      <Text>{`(${group?.positionNum})`}</Text>
                    </XStack>
                  </ListItem>
                </XStack>
              </TouchableOpacity>
            );
          })}
        </YStack>
        {/* </ScrollView> */}

        {/* <TouchableOpacity onPress={() => setCreateGroupSheetOpen(true)}>
          <XStack space="$3" borderRadius={8} alignItems="center">
            <AddGroup />
            <Text>创建分组</Text>
          </XStack>
        </TouchableOpacity> */}
      </YStack>
      {/* {createGroupSheetOpen ? (
        <CreateGroupSheet open={createGroupSheetOpen} onOpenChange={setCreateGroupSheetOpen} addGroup={addGroup} />
      ) : null} */}
    </View>
  );
};

interface Field {
  id: string;
  fieldName: string;
  type: string;
  options: Array<{ description: string; value: string }>;
}

interface Conditions {
  [key: string]: {
    options: string[];
  };
}

interface MoreComponentProps {
  conditions?: Conditions;
  setSearchData: React.Dispatch<React.SetStateAction<any>>;
  type: 'position' | 'shop' | 'poi';
}

const types = {
  position: 'position',
  shop: 'shopPositionRequest',
  poi: 'poiPositionRequest',
};

const systemFields = ['shopStatusList', 'shopNatures', 'shopTypes', 'positionStatusList'];
const MoreComponent: React.FC<MoreComponentProps> = ({ conditions = {}, setSearchData, type }) => {
  const { searchFields, searchShopFields, searchPoiFields } = useSearchField({ type });

  const handleCheckedChange = (field: Field, options: Array<{ value: string }>, checked: boolean) => {
    setSearchData((prevData: any) => {
      const targetKey = types[type];
      const updatedOptions = checked ? options.map((item) => item.value) : [];
      const updatedData = systemFields?.includes(field.id)
        ? {
            [targetKey]: {
              ...prevData[targetKey],
              [field.id]: updatedOptions,
              conditions: {
                ...prevData[targetKey]?.conditions,
                [field.id]: {
                  type: field.type,
                  options: updatedOptions,
                },
              },
            },
          }
        : {
            [targetKey]: {
              ...prevData[targetKey],
              conditions: {
                ...prevData[targetKey]?.conditions,
                [field.id]: {
                  type: field.type,
                  options: updatedOptions,
                },
              },
            },
          };

      return {
        ...prevData,
        ...updatedData,
      };
    });
  };

  const handleOptionClick = (field: Field, value: string, checked: boolean) => {
    setSearchData((prevData: any) => {
      const targetKey = types[type];
      const fieldOptions = conditions[field.id]?.options || [];
      const updatedFieldOptions = checked ? fieldOptions.filter((item) => item !== value) : [...fieldOptions, value];

      const updatedData = systemFields?.includes(field.id)
        ? {
            [targetKey]: {
              ...prevData[targetKey],
              [field.id]: updatedFieldOptions,
              conditions: {
                ...prevData[targetKey]?.conditions,
                [field.id]: {
                  type: field.type,
                  options: updatedFieldOptions,
                },
              },
            },
          }
        : {
            [targetKey]: {
              ...prevData[targetKey],
              conditions: {
                ...prevData[targetKey]?.conditions,
                [field.id]: {
                  type: field.type,
                  options: updatedFieldOptions,
                },
              },
            },
          };

      return {
        ...prevData,
        ...updatedData,
      };
    });
  };

  const fields = {
    position: searchFields,
    shop: searchShopFields,
    poi: searchPoiFields,
  };

  return (
    <YStack space="$2">
      {fields[type]?.map((field: Field) => {
        const options = field.options ?? [];
        return (
          <YStack key={field.id} space={4}>
            <XStack justifyContent="space-between" alignItems="center">
              <Text
                color="#141414"
                fontWeight="500"
                maxWidth="80%"
                fontSize={14}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {field.fieldName}
              </Text>
              <XStack space="$2" alignItems="center">
                <Checkbox
                  size="$4"
                  checked={conditions[field.id]?.options?.length === options.length}
                  backgroundColor="$white"
                  onCheckedChange={(checked: boolean) => handleCheckedChange(field, options, checked)}
                >
                  <Checkbox.Indicator
                    borderRadius={4}
                    style={{ backgroundColor: '#00BBB4', width: '20px', height: '20px' }}
                  >
                    <Check color="#fff" width={20} height={20} />
                  </Checkbox.Indicator>
                </Checkbox>
                <Label htmlFor={field.id}>全选</Label>
              </XStack>
            </XStack>
            <XStack space="$2" flexWrap="wrap">
              {options.map(({ description, value }) => {
                const fieldOptions = conditions[field.id]?.options || [];
                const checked = fieldOptions.includes(value);

                return (
                  <Button
                    key={value}
                    height={32}
                    noTextWrap
                    marginBottom={8}
                    backgroundColor={checked ? '$primary1Light' : '#FAFAFA'}
                    color={checked ? '$primaryLight' : '#141414'}
                    borderColor={checked ? '$primaryLight' : '#FFFFFF'}
                    onPress={() => handleOptionClick(field, value, checked)}
                  >
                    <Text fontSize={12} numberOfLines={1}>
                      {description}
                    </Text>
                  </Button>
                );
              })}
            </XStack>
          </YStack>
        );
      })}
    </YStack>
  );
};
