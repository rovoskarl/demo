import { useState, useCallback, useMemo, useEffect } from 'react';
import { create } from 'zustand';
import { difference, cloneDeep } from 'lodash-es';
import { useAddGroup, useService, useMapInfo, useSearch, useMarkerLocation, useBatchExpand } from '../hooks';
import { useUser } from '@/src/hooks';
import { TypeSelectionState } from '../definition/groupPointDefinition';
import { TCreateUserList } from '@/src/interfaces/map';
import { getUniqueArray } from '../../../utils/tools';
import { removeEmptyProperties } from '../constant/constants';

/**
 * @hook          usePointerGroupList
 * @description   点位分组管理
 * @param
 * @returns
 */
export function usePointerGroupList() {
  const [groupId, setGroupId] = useState<string | null>(null);
  const [isAdd, setIsAdd] = useState<boolean>(true);
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string | null; name: string }[]>([{ id: null, name: '列表' }]);
  const [createGroupSheetOpen, setCreateGroupSheetOpen] = useState(false);
  const { addGroup: addGroupService } = useAddGroup();
  const {
    getGroupList: getGroupListService,
    getListByGroupId,
    filterPostition: getPositionListService,
    getListByGroupIdWithSubLevel,
    getShopAndPoiList,
    getShopAndPoiPositionList,
  } = useService();
  const { user } = useUser();
  const {
    mapInfo: { id: mapId },
  } = useMapInfo();

  const {
    detail: { position, shopPositionRequest, poiPositionRequest },
  } = useSearch();

  const requestData = useMemo(
    () => ({
      mapId,
      mapPositionRequest: {
        colors: position?.colors,
        fieldConditions: position?.conditions
          ? Object.entries(position?.conditions ?? {}).reduce((acc: any, [fieldId, value]: any) => {
              if (
                value?.options?.length > 0 &&
                fieldId !== 'shopStatusList' &&
                fieldId !== 'shopNatures' &&
                fieldId !== 'shopTypes' &&
                fieldId !== 'positionStatusList'
              ) {
                acc.push({ fieldId, ...value });
              }
              return acc;
            }, [])
          : null,
        groupIds: position?.groupInfo?.map(({ id }: any) => id),
        positionStatusList: position?.positionStatusList,
        userIds: position?.creators?.map(({ createUserId }: TCreateUserList) => createUserId),
      },
      poiPositionRequest: {
        poiIdList: poiPositionRequest?.poiIdList,
        cityCodes: poiPositionRequest?.area?.filter(({ level }: any) => level === 2)?.map(({ code }: any) => code),
        countyCodes: poiPositionRequest?.area?.filter(({ level }: any) => level === 3)?.map(({ code }: any) => code),
        provinceCodes: poiPositionRequest?.area?.filter(({ level }: any) => level === 1)?.map(({ code }: any) => code),
      },
      shopPositionRequest: {
        cityCodes: shopPositionRequest?.area?.filter(({ level }: any) => level === 2)?.map(({ code }: any) => code),
        countyCodes: shopPositionRequest?.area?.filter(({ level }: any) => level === 3)?.map(({ code }: any) => code),
        provinceCodes: shopPositionRequest?.area?.filter(({ level }: any) => level === 1)?.map(({ code }: any) => code),
        colors: shopPositionRequest?.colors,
        fieldConditions: position?.conditions
          ? Object.entries(shopPositionRequest?.conditions ?? {}).reduce((acc: any, [fieldId, value]: any) => {
              if (
                value?.options?.length > 0 &&
                fieldId !== 'shopStatusList' &&
                fieldId !== 'shopNatures' &&
                fieldId !== 'shopTypes' &&
                fieldId !== 'positionStatusList'
              ) {
                acc.push({ fieldId, ...value });
              }
              return acc;
            }, [])
          : null,
        shopStatusList: shopPositionRequest?.shopStatusList ?? [],
        shopNatureList: shopPositionRequest?.shopNatures ?? [],
        shopTypeList: shopPositionRequest?.shopTypes ?? [],
        userIds: shopPositionRequest?.creators?.map(({ createUserId }: TCreateUserList) => createUserId),
      },
    }),
    [
      mapId,
      poiPositionRequest?.area,
      poiPositionRequest?.poiIdList,
      position?.colors,
      position?.conditions,
      position?.creators,
      position?.groupInfo,
      position?.positionStatusList,
      shopPositionRequest?.area,
      shopPositionRequest?.colors,
      shopPositionRequest?.conditions,
      shopPositionRequest?.creators,
      shopPositionRequest?.shopNatures,
      shopPositionRequest?.shopStatusList,
      shopPositionRequest?.shopTypes,
    ],
  );

  const filterData = removeEmptyProperties(requestData);

  const data = useMemo(() => {
    if (
      Object.keys(filterData?.mapPositionRequest ?? {})?.length ||
      Object.keys(filterData?.poiPositionRequest ?? {})?.length ||
      Object.keys(filterData?.shopPositionRequest ?? {})?.length
    ) {
      return filterData;
    }
    return {
      ...filterData,
      mapPositionRequest: filterData?.mapPositionRequest ? filterData?.mapPositionRequest : {},
      shopPositionRequest: filterData?.shopPositionRequest ? filterData?.shopPositionRequest : {},
      poiPositionRequest: filterData?.poiPositionRequest ? filterData?.poiPositionRequest : {},
    };
  }, [filterData]);

  const {
    folderIds,
    pointerList,
    pointerIds,
    groupList,
    groupIndexMap,
    setGroupList,
    setFolderIds,
    setPointerList,
    setPointerIds,
    setFolderPointerCount,
    setGroupIndexMap,
  } = useGroupMapSelection();
  const [filterGroupList, setFilterGroupList] = useState<any[]>([]);

  useEffect(() => {
    setFilterGroupList(() => {
      return groupList?.filter(
        (item) => (item?.positionType === 1 || item?.folder) && !item?.groupType && item?.groupType !== 0,
      );
    });
  }, [groupList]);

  /**
   * @method      queryGroupList
   * @description 查询分组下分组及点位组合列表
   * @param       {String}              groupName
   * @param       {String | Number}     parentId
   */
  const queryGroupList = useCallback(
    ({ groupName = '', parentId }: { groupName?: string; parentId?: string | null }) => {
      return new Promise((resolve) => {
        if (
          Object.keys(data?.mapPositionRequest ?? {})?.length ||
          Object.keys(data?.poiPositionRequest ?? {})?.length ||
          Object.keys(data?.shopPositionRequest ?? {})?.length
        ) {
          getPositionListService(data)
            .then((res) => {
              setGroupList(res?.positionList);
              resolve(true);
            })
            .catch(() => {
              resolve(false);
            });
          return false;
        } else {
          const queryList = [
            getGroupListService({ groupName, userId: user?.shUserId, parentId: parentId ?? mapId, mapId }),
          ];
          if (groupId) {
            queryList.push(getListByGroupId({ groupId }));
          } else {
            queryList.push(Promise.resolve([]));
          }
          Promise.all(queryList)
            .then(([groupData, positionData]) => {
              groupData?.forEach((item: any) => {
                item.folder = true;
              });
              if (groupId) {
                setGroupList(getUniqueArray([...groupData, ...positionData], 'id'));
              } else {
                setGroupList(getUniqueArray([...groupData], 'id'));
              }
              resolve(true);
            })
            .catch(() => {
              resolve(false);
            });
        }
      });
    },
    [data, getPositionListService, setGroupList, getGroupListService, user?.shUserId, mapId, groupId, getListByGroupId],
  );

  /**
   * @method      querySingleGroupList
   * @description 查询当前分组下点位
   * @param       {string | number}  currentGroupId
   */
  const querySingleGroupList = useCallback(
    async (currentGroupId: string | number | null) => {
      setGroupList([]);

      const { positionList: positionList } = await getPositionListService({
        ...data,
        mapPositionRequest: {
          ...data.mapPositionRequest,
          groupIds: currentGroupId ? [currentGroupId] : data.mapPositionRequest?.groupIds,
        },
      });
      positionList?.forEach((item: any) => {
        item.folder = false;
      });
      setGroupList(positionList);
    },
    [setGroupList, getPositionListService, data],
  );

  /**
   * @method      addGroup
   * @description 新增分组
   * @param       {String}  name  分组名称
   */
  const addGroup = useCallback(
    ({ name }: { name: string }) => {
      addGroupService({ name, parentId: groupId }).then(() => {
        queryGroupList({ groupName: '', parentId: groupId });
        setCreateGroupSheetOpen(false);
      });
    },
    [addGroupService, queryGroupList, groupId],
  );

  /**
   * @method      handleGroupSelect
   * @description 分组名称点击
   * @param       {Object}  item   分组
   */
  const handleGroupSelect = async (item: Record<string, any>) => {
    if (item?.mapGroupDTO) {
      setIsAdd(false);
      if (item?.mapGroupDTO?.adCode) {
        const shopAndPoiPositionList = await getShopAndPoiPositionList({ ...item?.mapGroupDTO, mapId });
        setGroupList(getUniqueArray([...shopAndPoiPositionList], 'id'));
      } else {
        const shopAndPoiList = await getShopAndPoiList({ ...item?.mapGroupDTO, mapId });
        setGroupList(shopAndPoiList?.map((_item: any) => ({ ..._item, folder: true })));
      }
    } else {
      setIsAdd(true);
      setGroupId(item.id);
    }

    const index = breadcrumbs.findIndex((elem) => elem.id === item.id);
    if (index === -1 && item?.mapGroupDTO) {
      setBreadcrumbs((prev) => [...prev, { id: item?.id, name: item?.name, mapGroupDTO: item?.mapGroupDTO }]);
    } else {
      setBreadcrumbs((prev) => [...prev, { id: item?.id, name: item?.name }]);
    }
    setFolderPointerCount(0);
  };

  /**
   * @method        handleAllSelected
   * @description   全选取消全选分组
   * @param         {Boolean}      flag
   */
  const handleAllSelected = (flag: boolean) => {
    let folderId: any = [];
    let pointerId: any = [];
    // 批量查询分组点位集合
    let groupIds: any[] = [];
    let batchGroupPointertNum = 0;
    filterGroupList?.forEach((elem: Record<string, any>) => {
      if (elem.folder) {
        folderId.push(elem.id);
        // 查询分组-下点位
        if (flag) {
          groupIds.push(elem.id);
          batchGroupPointertNum += elem.positionNum;
        } else {
          batchGroupPointertNum -= elem.positionNum;
        }
      } else {
        pointerId.push(elem.id);
      }
    });
    setPointerIds(pointerId);
    setFolderPointerCount(batchGroupPointertNum);
    setGroupIndexMap([]);
    // 查询分组-下点位
    if (flag) {
      setFolderIds([...folderId]);
      let pointerIndexs: any = [];
      let pointerSources: any = [];
      if (groupIds?.length) {
        getListByGroupIdWithSubLevel({
          mapId,
          groupIdList: groupIds,
        })
          .then((response) => {
            pointerSources = response;
            response.forEach((elem: any) => {
              pointerIndexs.push({
                id: elem.groupId,
                index: elem.id,
              });
            });
          })
          .then(() => {
            // 缓存分组下的点位ID
            const groupIdMap = getUniqueArray([...groupIndexMap, ...pointerIndexs], 'id');
            setGroupIndexMap(groupIdMap);
            const clonePointerIds = Array.from(new Set([...pointerId, ...pointerSources.map((elem: any) => elem.id)]));
            setPointerIds(clonePointerIds);
            setPointerList(
              getUniqueArray([...filterGroupList.filter((elem: any) => !elem.folder), ...pointerSources], 'id'),
            );
          });
      } else {
        setPointerIds(pointerId);
        setPointerList([...filterGroupList.filter((elem: any) => !elem.folder)]);
      }
    } else {
      setFolderIds([]);
      setPointerIds([]);
      setPointerList([]);
    }
  };

  /**
   * @method          handleGroupSelcted
   * @description     单个分组选择与取消
   * @param           {Boolean}  flag
   * @param           {Object}   item
   */
  const handleGroupSelcted = async (flag: boolean, item: Record<string, any>) => {
    // 选中分组
    const res = await getListByGroupIdWithSubLevel({
      mapId,
      groupIdList: [item.id],
    });
    const subPositionIds = res.map((elem: any) => elem.id);
    if (flag) {
      setFolderIds(Array.from(new Set(folderIds.concat([item.id]))));
      // 查询分组下点位
      const combinePointerList = getUniqueArray([...pointerList, ...res], 'id');
      const combinePointerIds = Array.from(new Set([...pointerIds, ...subPositionIds]));
      setPointerIds([...combinePointerIds]);
      setPointerList(combinePointerList);
      // 缓存分组下的点位ID
      setGroupIndexMap(
        getUniqueArray(
          [
            ...groupIndexMap,
            {
              id: item.id,
              index: subPositionIds,
            },
          ],
          'id',
        ),
      );
    } else {
      // 取消选中分组
      folderIds.splice(
        folderIds.findIndex((elem: any) => elem === item.id),
        1,
      );
      setFolderIds(folderIds);
      const newData = pointerList.filter((elem) => !subPositionIds.includes(elem.id));
      const newPointerIds = pointerIds.filter((elem) => !subPositionIds.includes(elem));
      setPointerIds(Array.from(new Set([...newPointerIds])));
      setPointerList(newData);
    }
  };

  /**
   * @method          setGroupSelected
   * @description     分组及点位选择状态及数据控制
   * @param           {Boolean}   flag
   * @param           {Object}    item
   * @returns
   */
  const setGroupSelected = async (flag: boolean, item: Record<string, any> | null) => {
    // 全选|取消全选 分组与点位分开处理，服务不支持当前分组下的点位处理
    if (!item) {
      handleAllSelected(flag);
      return;
    }
    // folder-选择单个分组
    if (item?.folder) {
      handleGroupSelcted(flag, item);
      return;
    }
    // pointer-选择点位
    updatePointerItem(flag, item);
  };

  /**
   * @method          updatePointerItem
   * @description     更新单个点位选择状态及数据
   * @param           {boolean}     flag
   * @param           {object}      item
   */
  const updatePointerItem = (flag: boolean, item: any) => {
    if (flag) {
      setPointerIds([...pointerIds, item.id]);
      setPointerList(getUniqueArray([...pointerList, item], 'id'));
      // 取消选中点位
    } else {
      const clonePointerList = cloneDeep(pointerList);
      const index = clonePointerList.findIndex((elem) => elem.id === item.id);
      if (index > -1) {
        clonePointerList.splice(index, 1);
      }
      setPointerList(clonePointerList);
      const sequence = pointerIds.findIndex((elem) => elem === item.id);
      if (sequence > -1) {
        pointerIds.splice(sequence, 1);
      }
      setPointerIds([...pointerIds]);
    }
  };

  /**
   * @method          onChangeCurPositionerList
   * @description     已选分组弹框checkChange事件
   * @param           {boolean}      flag
   * @param           {object}       item
   */
  const onChangeCurPositionerList = (flag: boolean, item: any) => {
    // 勾选
    if (flag) {
      setPointerIds(Array.from(new Set([...pointerIds, item.id])));
      setPointerList(getUniqueArray([...pointerList, item], 'id'));
    } else {
      const index = pointerIds.findIndex((elem) => elem === item?.id);
      if (index > -1) {
        pointerIds.splice(index, 1);
        setPointerIds([...pointerIds]);
        pointerList.splice(
          pointerList.findIndex((elem) => elem.id === item?.id),
          1,
        );
        setPointerList(pointerList);
      }
      // 取消选中点位需要对比，分组下全部点位没选中，删除分组id-folderIds
      let groupPointIds = groupIndexMap.filter((element) => element.id === item?.groupId);
      groupPointIds = groupPointIds?.[0]?.index || [];
      const compare = difference(groupPointIds, pointerIds);
      if (compare.length > 0) {
        const folderIndex = folderIds.findIndex((folderId) => folderId === item.groupId);
        if (folderIndex > -1) {
          folderIds.splice(folderIndex, 1);
          setFolderIds(folderIds);
        }
      }
    }
  };

  /**
   * @method        clearGroupSelectionStore
   * @description   清理缓存
   * @param
   */
  const clearGroupSelectionStore = () => {
    setPointerList([]);
    setPointerIds([]);
    setGroupIndexMap([]);
    setFolderIds([]);
    setFolderPointerCount(0);
  };

  /**
   * @method        updateSinglePositionItem
   * @description   已选-单选点击更新单个点位
   * @param item
   */
  const updateSinglePositionItem = (item: Record<string, any>) => {
    const clonePointerList = cloneDeep(pointerList);
    // 更新已选点位
    const index = clonePointerList.findIndex((elem) => elem.id === item.id);
    if (index > -1) {
      clonePointerList.splice(index, 1);
    } else {
      clonePointerList.push(item);
    }
    setPointerIds([...clonePointerList.map(({ id }) => id)]);
    setPointerList([...clonePointerList]);
  };

  return {
    groupId,
    breadcrumbs,
    createGroupSheetOpen,
    pointerIds,
    groupList,
    queryGroupList,
    setBreadcrumbs,
    setCreateGroupSheetOpen,
    addGroup,
    handleGroupSelect,
    isAdd,
    setGroupId,
    querySingleGroupList,
    setGroupSelected,
    onChangeCurPositionerList,
    setPointerIds,
    clearGroupSelectionStore,
    updateSinglePositionItem,
  };
}

/**
 * @hooks       useBatchUpdatePoint
 * @description 批量操作
 * @returns
 */
export const useBatchUpdatePoint = () => {
  const {
    color,
    description,
    pointerList,
    folderIds,
    setSelectMode,
    setSelectType,
    setFolderIds,
    setPointerIds,
    setPointerList,
  } = useGroupMapSelection();
  const { batchUpdatePosition, batchMovePosition, batchDeletePosition } = useService();
  const {
    mapInfo: { id: mapId },
  } = useMapInfo();
  const { markerLocationDetail } = useMarkerLocation();
  const { groupId, groupName } = useBatchExpand();

  const { iconInfo } = markerLocationDetail;

  /**
   * @method        handleUpdate
   * @description   批量更新
   * @param         {Function}    success
   * @param         {Function}    fail
   */
  const handleUpdate = async ({ success, fail }: { success: () => void; fail: () => void }) => {
    const idList = pointerList.map((item) => item.id);
    const groupIdList = folderIds.length ? folderIds : [];
    batchUpdatePosition({
      color: color?.[0],
      description: description,
      icon: iconInfo?.[0]?.url,
      idList: idList,
      groupIdList,
      mapId,
    })
      .then(() => {
        setSelectType('list');
        setSelectMode(false);
        setFolderIds([]);
        setPointerIds([]);
        setPointerList([]);
        success();
      })
      .catch(() => {
        fail();
      });
  };

  /**
   * @method        handleMove
   * @description   批量移动
   * @param         {Function}    success
   * @param         {Function}    fail
   */
  const handleMove = ({ success, fail }: { success: () => void; fail: () => void }) => {
    const idList = pointerList.map((item) => item.id);
    batchMovePosition({
      groupId,
      groupName,
      ids: idList,
      mapId,
    })
      .then(() => {
        setSelectType('list');
        setSelectMode(false);
        setFolderIds([]);
        setPointerIds([]);
        setPointerList([]);
        success?.();
      })
      .catch(() => {
        fail();
      });
  };

  /**
   * @method        handleDelete
   * @description   批量删除
   * @param         {Function}    success
   * @param         {Function}    fail
   * @param         {Boolean}     deleteFolder
   */
  const handleDelete = ({
    success,
    fail,
    deleteFolder,
  }: {
    success: () => void;
    fail: () => void;
    deleteFolder: boolean;
  }) => {
    const idList = pointerList.map((item) => item.id);
    batchDeletePosition({
      positionIdList: idList,
      groupIdList: deleteFolder ? folderIds : [],
      mapId,
    })
      .then(() => {
        setSelectType('list');
        setFolderIds([]);
        setPointerList([]);
        success?.();
      })
      .catch(() => {
        fail();
      });
  };

  return {
    handleUpdate,
    handleMove,
    handleDelete,
  };
};

/**
 * @store         useGroupMapSelection
 * @description   分组及点位存储store
 * @param         set
 */
export const useGroupMapSelection = create<TypeSelectionState>((set) => ({
  selectType: 'list',
  typeSheetOpen: false,
  selectMode: false,
  icon: '',
  color: [1],
  description: '',
  folderIds: [],
  folderPointerCount: 0,
  pointerList: [],
  pointerIds: [],
  groupList: [],
  // 索引数据
  groupIndexMap: [],
  setSelectType: (selectType: string) => {
    set({ selectType });
  },
  setTypeSheetOpen: (typeSheetOpen: boolean) => {
    set({ typeSheetOpen });
  },
  setSelectMode: (selectMode: boolean) => {
    set({ selectMode });
  },
  setIcon: (icon: string) => {
    set({ icon });
  },
  setColor: (color: any[]) => {
    set({ color });
  },
  setDescription: (description: string) => {
    set({ description });
  },
  setFolderIds: (folderIds: Array<any>) => {
    set({ folderIds });
  },
  setFolderPointerCount: (folderPointerCount: number) => {
    set({ folderPointerCount });
  },
  setPointerList: (pointerList: Array<Record<string, any>>) => {
    set({ pointerList });
  },
  setPointerIds: (pointerIds: Array<Record<string, any>>) => {
    set({ pointerIds });
  },
  setGroupList: (groupList: Array<Record<string, any>>) => {
    set({ groupList });
  },
  setGroupIndexMap: (groupIndexMap: Record<string, any>[]) => {
    set({ groupIndexMap });
  },
}));
