import { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { XStack, Text } from 'tamagui';
import { CalanderCheck, AddGroup } from '@/src/icons';
import { Breadcrumb, WithAuth } from '@/src/components';
import { ROUTER_FLAG } from '@/src/navigation';
import {
  usePointerGroupList,
  useExpandPunter,
  useMapInfo,
  useGroupMapSelection,
  useToast,
  useService,
  useRenderType,
} from '../hooks';
import { ExpandGroupViewMap } from './ExpandGroupViewMap';
import { ExpandGroupViewToast } from './ExpandGroupViewToast';
import { CreatePunterGroupSheet, ChooseGroupMapSheet } from './ExpandPunterSheet';
import { ExpandGroupListItem } from './ExpandGroupListItem';
import { ExpandGroupBatchOperation } from './ExpandGroupBatchOperation';
import { ChooseNaviSheet } from './ExpandPunterSheet';
import { GroupManage } from '../constant/label';
import { ButtonPermission } from '../constant/constants';
import { getUniqueArray } from '@/src/utils/tools';

export const ExpandGroupPointList = WithAuth(({ hideSearchGroup, permissions }: any) => {
  const hasChooseList = permissions?.find((item: any) => item.url === ButtonPermission.ChooseList);
  const hasChooseMap = permissions?.find((item: any) => item.url === ButtonPermission.ChooseMap);
  const hasCreateGroup = permissions?.find((item: any) => item.url === ButtonPermission.CreateGroup);
  const { navigation } = useExpandPunter();
  const {
    groupId,
    groupList,
    breadcrumbs,
    createGroupSheetOpen,
    addGroup,
    setBreadcrumbs,
    isAdd,
    setGroupId,
    handleGroupSelect,
    setCreateGroupSheetOpen,
    queryGroupList,
    setGroupSelected,
    clearGroupSelectionStore,
  } = usePointerGroupList();
  const {
    selectType,
    selectMode,
    typeSheetOpen,
    folderIds,
    setGroupList,
    pointerIds,
    folderPointerCount,
    setTypeSheetOpen,
    setSelectMode,
  } = useGroupMapSelection();
  const {
    mapInfo: { id: mapId },
  } = useMapInfo();
  const { getShopAndPoiList, getShopAndPoiPositionList } = useService();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  // 隐藏
  const [hideElement, setHideElement] = useState<boolean>(true);
  const [openNavi, setOpenNavi] = useState(false);
  const [modal, setModal] = useState({ tip: GroupManage.updatingTip, type: 'loading' });
  const { update } = useRenderType();
  const [filterGroupList, setFilterGroupList] = useState<any[]>([]);

  useEffect(() => {
    if (mapId) {
      queryGroupList({ parentId: groupId || mapId });
    }
  }, [queryGroupList, mapId, groupId]);

  useEffect(() => {
    if (mapId) {
      setGroupId(null);
      setBreadcrumbs([{ id: null, name: '列表' }]);
    }
  }, [mapId, setBreadcrumbs, setGroupId]);

  useEffect(() => {
    const selectedFlag =
      (folderIds?.length ?? 0) + (pointerIds?.length ?? 0) - (folderPointerCount ?? 0) ===
      ((groupList?.length || filterGroupList?.length) ?? 0);
    setSelectAll(selectedFlag);
  }, [folderIds, pointerIds, groupList, folderPointerCount, filterGroupList?.length]);

  if (selectType === 'map') {
    return (
      <ExpandGroupViewMap
        clickHandler={() => {
          clearGroupSelectionStore();
          update('home');
        }}
      />
    );
  }

  useEffect(() => {
    if (selectMode) {
      setFilterGroupList(() => {
        return groupList?.filter(
          (item) => (item?.positionType === 1 || item?.folder) && !item?.groupType && item?.groupType !== 0,
        );
      });
    }
  }, [groupList, selectMode]);

  return (
    <View
      style={{ display: 'flex', height: '85%', backgroundColor: '#F5F5F5' }}
      className="absolute flex-1 w-full bottom-0 bg-gray-100 rounded-t-2xl z-10"
    >
      {loading && <ExpandGroupViewToast tip={modal.tip} type={modal.type} />}
      <XStack className="flex mt-4 ml-4 mr-4 mb-5">
        <Text className="flex-1 font-bold" style={{ fontSize: 14 }}>
          {GroupManage.sortByUpdateTime}
        </Text>
        {hasChooseList || hasChooseMap ? (
          !selectMode ? (
            <TouchableOpacity
              onPress={() => {
                setTypeSheetOpen(true);
              }}
            >
              <View className="flex flex-row">
                <CalanderCheck />
                <Text className="leading-4 pt-0.5">{GroupManage.selectText}</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View className="flex flex-row">
              {selectAll ? (
                <TouchableOpacity
                  onPress={() => {
                    setSelectAll(false);
                    setGroupSelected(false, null);
                  }}
                >
                  <Text className="leading-4 pt-0.5 text-teal-400 mr-6" style={{ fontSize: 15 }}>
                    {GroupManage.selectInverseText}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setSelectAll(true);
                    setGroupSelected(true, null);
                  }}
                >
                  <Text className="leading-4 pt-0.5 text-teal-400 mr-6" style={{ fontSize: 15 }}>
                    {GroupManage.selectAllText}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => {
                  setSelectMode(false);
                  clearGroupSelectionStore();
                }}
              >
                <Text className="leading-4 pt-0.5 text-teal-400" style={{ fontSize: 15 }}>
                  {GroupManage.completeText}
                </Text>
              </TouchableOpacity>
            </View>
          )
        ) : null}
      </XStack>
      {/* 已选分组显示面包屑 */}
      {groupId || breadcrumbs?.length > 1 ? (
        <Breadcrumb className="bg-transparent px-4 pb-4 pt-0">
          {breadcrumbs.map(({ name, id, ..._item }: any) => (
            <Breadcrumb.Item
              onPress={async () => {
                if (folderIds.length === 0 && pointerIds.length === 0) {
                  setModal({ tip: GroupManage.loadingTip, type: 'loading' });
                  setLoading(true);
                  const index = breadcrumbs.findIndex((item) => item.id === id);
                  setBreadcrumbs((prev) => prev.slice(0, index + 1));
                  // debounce(() => {
                  //   queryGroupList({ parentId: id as string });
                  // }, 1000);
                  if (_item?.mapGroupDTO) {
                    if (_item?.mapGroupDTO?.adCode) {
                      const shopAndPoiPositionList = await getShopAndPoiPositionList({ ..._item?.mapGroupDTO, mapId });
                      setGroupList(getUniqueArray([...shopAndPoiPositionList], 'id'));
                    } else {
                      const shopAndPoiList = await getShopAndPoiList({ ..._item?.mapGroupDTO, mapId });
                      setGroupList(shopAndPoiList?.map((_i: any) => ({ ..._i, folder: true })));
                    }
                  } else {
                    setGroupId(id);
                    queryGroupList({ parentId: id as string });
                  }

                  setLoading(false);
                } else {
                  toast.show(GroupManage.dealWithPointer);
                }
              }}
              key={`${name}-${id}`}
            >
              {name}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      ) : null}

      {/* 进入文件夹显示添加 */}
      {hasCreateGroup && isAdd ? (
        !selectMode ? (
          <TouchableOpacity
            onPress={() => {
              setCreateGroupSheetOpen(true);
            }}
          >
            <View className="bg-white flex items-center flex-row border-gray-200 rounded-lg ml-3 mr-3 mb-3 px-4 py-3.5">
              <AddGroup width={26} height={26} />
              <Text marginLeft={12} marginBottom={4} fontSize={16}>
                {GroupManage.addFolder}
              </Text>
            </View>
          </TouchableOpacity>
        ) : null
      ) : null}

      <FlatList
        className="ml-3 mr-3 mb-3"
        data={selectMode ? filterGroupList : groupList}
        renderItem={({ item }) => (
          <ExpandGroupListItem
            item={item}
            selectMode={selectMode}
            checkedChange={setGroupSelected}
            naviChange={(status: boolean) => {
              setOpenNavi(status);
            }}
            handleGroupSelect={handleGroupSelect} // 点击分组名，查询
          />
        )}
        refreshing={refresh}
        keyExtractor={(item: Record<string, any>) => `${item.id}${item.name}${new Date().getTime()}`}
        onRefresh={() => {
          if (selectMode) {
            return false;
          }
          setGroupId(null);
          setBreadcrumbs([{ id: null, name: '列表' }]);
          queryGroupList({ parentId: null }).then(() => {
            setRefresh(false);
          });
        }}
        onEndReached={async () => {}}
      />
      {/* 批量编辑 */}
      {selectMode ? (
        <ExpandGroupBatchOperation
          handleModal={(flag: any) => {
            hideSearchGroup?.(flag);
            setHideElement(flag);
          }}
        />
      ) : null}

      {/* 新建文件夹 */}
      <View>
        {createGroupSheetOpen ? (
          <CreatePunterGroupSheet
            open={createGroupSheetOpen}
            onOpenChange={setCreateGroupSheetOpen}
            addGroup={addGroup}
          />
        ) : null}
      </View>
      {/* 从列表或地图选择 */}
      <View>
        {typeSheetOpen ? (
          <ChooseGroupMapSheet
            hasChooseList={hasChooseList}
            hasChooseMap={hasChooseMap}
            open={typeSheetOpen}
            onOpenChange={() => {
              setTypeSheetOpen(false);
            }}
            forwardMapSelection={() => {
              navigation.navigate(ROUTER_FLAG.MapPunterMapSelection);
            }}
          />
        ) : null}
      </View>
      {/* 查看地图悬浮图标 */}
      <View>
        {hideElement && !selectMode ? (
          <ExpandGroupViewMap
            clickHandler={() => {
              setSelectMode(false);
              clearGroupSelectionStore();
              update('home');
            }}
          />
        ) : null}
      </View>
      <View>
        {openNavi ? (
          <ChooseNaviSheet
            open={openNavi}
            onOpenChange={(status: boolean) => {
              setOpenNavi(status);
            }}
          />
        ) : null}
      </View>
    </View>
  );
});
