import { useDependency } from '@/src/ioc';
import { StoreSelectService } from '../service/service';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBrandInfo } from './useBrandInfo';
import { useUser } from '@/src/hooks';
import { useMapInfo } from './useMapInfo';
import { Asset } from 'react-native-image-picker';
import { useMarkerLocation } from './useMarkerLocation';
import { useSearch } from './useSearch';
import { TCreateUserList } from '@/src/interfaces/map';
import { positionSearchFields, removeEmptyProperties, shopSearchFields, taskIcon } from '../constant/constants';
import { usePointCount, useSearchInfo } from '.';

export const useService = () => {
  const service = useDependency(StoreSelectService);
  const uploadFiles = service.uploadFiles;
  const uploadFile = service.uploadFile;
  const getMapList = service.getMapList;
  const addLocation = service.addLocation;
  const getGroupList = service.getGroupList;
  const getListByGroupId = service.getListByGroupId;
  const addGroup = service.addGroup;
  const uploadIcon = service.uploadIcon;
  const getIcons = service.getIcons;
  const addIcons = service.addIcons;
  const delIcons = service.delIcons;
  const getPositionList = service.getPositionList;
  const getShopAndPoiList = service.getShopAndPoiList;
  const batchImportExpandPointer = service.batchImportExpandPointer;
  const getGroupFieldList = service.getGroupFieldList;
  const getGroupFields = service.getGroupFields;
  const getPositionDetail = service.getPositionDetail;
  const getPositionRecord = service.getPositionRecord;
  const deletePosition = service.deletePosition;
  const updateDateLocation = service.updateDateLocation;
  const getPositionListWithSearch = service.getPositionListWithSearch;
  const getShopCreateUser = service.getShopCreateUser;
  const getCreateUserList = service.getCreateUserList;
  const batchUpdatePosition = service.batchUpdatePosition;
  const batchDeletePosition = service.batchDeletePosition;
  const batchMovePosition = service.batchMovePosition;
  const getCountWithAdLevel = service.getCountWithAdLevel;
  const getSearchField = service.getSearchField;
  const getListByGroupIdWithSubLevel = service.listByGroupIdWithSubLevel;
  const getCustomFieldDetail = service.getCustomFieldDetail;
  const getShopDetail = service.getShopDetail;
  const getCoopetitionDetail = service.getCoopetitionDetail;
  const getNearPositionInfo = service.getNearPositionInfo;
  const getShopAndPoiPositionList = service.getShopAndPoiPositionList;
  const getProvinceCityArea = service.getProvinceCityArea;
  const getPoiList = service.getPoiList;
  const filterPostition = service.filterPostition;
  const getCountByAdLevel = service.getCountByAdLevel;
  const getCustomFieldGroupDetail = service.getCustomFieldGroupDetail;
  const getOSSToken = service.getOSSToken;
  const getOSSFileUrl = service.getFileUrl;
  const flowAuditReject = service.flowAuditReject;
  const flowAuditApprove = service.flowAuditApprove;
  const flowAuditTurn = service.flowAuditTurn;
  const getTaskList = service.getTaskList;
  const getDistrict = service.getDistrict;
  const collectTaskPosition = service.collectTaskPosition;
  const getMapIdByAdCode = service.getMapIdByAdCode;

  return {
    uploadFiles,
    getTaskList,
    getDistrict,
    getOSSToken,
    getOSSFileUrl,
    getSearchField,
    getCountByAdLevel,
    filterPostition,
    getPoiList,
    getCountWithAdLevel,
    getNearPositionInfo,
    getMapList,
    uploadFile,
    getGroupFieldList,
    getPositionList,
    getShopCreateUser,
    getPositionDetail,
    getGroupFields,
    updateDateLocation,
    getPositionListWithSearch,
    delIcons,
    getPositionRecord,
    addIcons,
    deletePosition,
    addLocation,
    getGroupList,
    addGroup,
    getShopAndPoiList,
    getShopAndPoiPositionList,
    uploadIcon,
    getIcons,
    batchImportExpandPointer,
    getCreateUserList,
    batchUpdatePosition,
    batchDeletePosition,
    batchMovePosition,
    getListByGroupIdWithSubLevel,
    getListByGroupId,
    getCustomFieldDetail,
    getShopDetail,
    getCoopetitionDetail,
    getProvinceCityArea,
    getCustomFieldGroupDetail,
    flowAuditReject,
    flowAuditApprove,
    flowAuditTurn,
    collectTaskPosition,
    getMapIdByAdCode,
  };
};

export const usePositionRecord = () => {
  const { getPositionRecord } = useService();
  const [records, setRecords] = useState<any[]>([]);
  const { user } = useUser();
  const {
    mapInfo: { id: mapId },
  } = useMapInfo();
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadMoreData = async () => {
      if (!hasMore) {
        return;
      }
      setLoading(true);
      const { result = [], total = 0 } = await getPositionRecord({ mapId, pageSize: 5, pageNum });
      setHasMore(pageNum * 5 < total);
      setRecords((prevData) => [...prevData, ...result]);
      setLoading(false);
    };

    if (mapId && user) {
      loadMoreData();
    }
  }, [getPositionRecord, hasMore, mapId, pageNum, user]);

  const loadMore = () => {
    if (hasMore) {
      setPageNum((prevPage) => prevPage + 1);
    }
  };

  return { records, loading, loadMore, hasMore };
};

export const useMapList = () => {
  const { getMapList } = useService();
  const [mapList, setMapList] = useState([]);
  const { brandId } = useBrandInfo();
  const { user } = useUser();
  const { mapInfo, updateMapInfo } = useMapInfo();
  useEffect(() => {
    if (brandId) {
      getMapList({ brandId, userId: user?.shUserId }).then((res) => {
        setMapList(res);
        if (!mapInfo?.id) {
          updateMapInfo(res[0]);
        }
      });
    }
  }, [brandId, getMapList, mapInfo, mapInfo?.id, updateMapInfo, user?.shUserId]);

  return { mapList };
};

export const usePoints = () => {
  const { filterPostition: getPositionListService } = useService();
  const [points, setPoints] = useState<Record<string, any>[]>([]);

  const { setCounts }: any = usePointCount();
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
    [mapId, position, poiPositionRequest, shopPositionRequest],
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

  const getPoints = useCallback(
    ({ searchContent = '' }: { searchContent?: string }) => {
      setPoints([]);
      getPositionListService(data).then((res) => {
        setPoints(res?.positionList);
        if (
          Object.keys(position)?.length > 0 ||
          Object.keys(shopPositionRequest)?.length > 0 ||
          Object.keys(poiPositionRequest)?.length > 0
        ) {
          setCounts({
            mapPositionCount: res?.mapPositionCount,
            poiPositionCount: res?.poiPositionCount,
            shopPositionCount: res?.shopPositionCount,
          });
        }
      });
    },
    [data, getPositionListService, poiPositionRequest, position, setCounts, shopPositionRequest],
  );

  useEffect(() => {
    if (mapId) {
      getPoints({});
    }
  }, [getPoints, mapId]);

  return { points, update: getPoints };
};

export const useTask = () => {
  const [list, setList] = useState<any[]>([]);
  const {
    mapInfo: { id: mapId },
  } = useMapInfo();
  const { getDistrict, getTaskList } = useService();

  useEffect(() => {
    if (mapId) {
      getDistrict(mapId).then((res) => {
        getTaskList({
          cityCodes: res?.citys?.map((item: any) => item.code),
          districtCodes: res?.countys?.map((item: any) => item.code),
          provinceCodes: res?.provinces?.map((item: any) => item.code),
        }).then((r) => {
          setList(
            r.map((item: any) => {
              return { ...item, name: item?.taskName, type: 'task', icon: taskIcon[item?.statusCode === 3 ? 2 : 1] };
            }),
          );
        });
      });
    }
  }, [getDistrict, getTaskList, mapId]);

  return { list };
};
export const usePositionListWithSearch = () => {
  const { getPositionListWithSearch } = useService();
  const [list, setList] = useState<any[]>([]);
  const {
    mapInfo: { id: mapId },
  } = useMapInfo();
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [positionName, setPositionName] = useState('');

  useEffect(() => {
    const loadMoreData = async () => {
      if (!hasMore) {
        return;
      }
      setLoading(true);
      const { result = [], total = 0 } = await getPositionListWithSearch({
        mapId,
        keyword: positionName,
        pageSize: 5,
        pageNum,
      });
      setHasMore(pageNum * 5 < total);
      setList((prevData) => [...prevData, ...result]);
      setLoading(false);
    };

    if (mapId && positionName) {
      loadMoreData();
    }
  }, [getPositionListWithSearch, hasMore, mapId, pageNum, positionName]);

  const loadMore = () => {
    if (hasMore) {
      setPageNum((prevPage) => prevPage + 1);
    }
  };

  const updatePositionName = (newPositionName: string) => {
    if (positionName === newPositionName) {
      return;
    }
    setList([]);
    setPageNum(1);
    setHasMore(true);
    setPositionName(newPositionName);
  };

  return { list, loading, loadMore, updatePositionName, hasMore, setList };
};

export const useGroupList = () => {
  const { getGroupList: getGroupListService } = useService();
  const [list, setGroupList] = useState([]);
  const { user } = useUser();
  const {
    mapInfo: { id: mapId },
  } = useMapInfo();

  const getGroupList = useCallback(
    ({ groupName = '', parentId }: { groupName?: string; parentId?: string | null }) => {
      getGroupListService({ groupName, userId: user?.shUserId, mapId, parentId: parentId ?? mapId }).then((res) => {
        setGroupList(res?.filter((item: any) => !item?.groupType));
      });
    },
    [getGroupListService, mapId, user?.shUserId],
  );

  useEffect(() => {
    if (mapId) {
      getGroupList({ parentId: mapId });
    }
  }, [getGroupList, mapId]);

  return { list, getGroupList, setGroupList };
};

export const useAddGroup = () => {
  const { addGroup: addGroupService } = useService();
  const { brandId } = useBrandInfo();
  const {
    mapInfo: { id: mapId },
  } = useMapInfo();
  const { user } = useUser();

  const addGroup = useCallback(
    ({ name = '', parentId }: { name?: string; parentId?: string | null }) => {
      return addGroupService({ name, userId: user?.shUserId, mapId: mapId, parentId: parentId ?? mapId, brandId });
    },
    [addGroupService, brandId, mapId, user?.shUserId],
  );

  return { addGroup };
};

export const useUploadFile = () => {
  const { uploadFile } = useService();

  const upload = useCallback(
    ({ file }: { file: any }) => {
      let formData = new FormData();

      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });
      return uploadFile(formData);
    },
    [uploadFile],
  );

  return { upload };
};

export const useUpload = () => {
  const { uploadIcon, uploadFiles, addIcons } = useService();
  const {
    mapInfo: { id: mapId },
  } = useMapInfo();
  const upload = useCallback(
    ({ type, files }: { type: 1 | 2; files: Asset[] | undefined }) => {
      let formData = new FormData();

      files?.forEach(({ fileName, type: imageType, uri }) => {
        formData.append('files', {
          uri: uri,
          type: imageType,
          name: fileName,
        });
      });
      if (type === 1) {
        return uploadFiles(formData);
      }
      return uploadIcon(formData).then((res) => {
        if (res) {
          return addIcons({ mapId, url: res });
        }
      });
    },
    [addIcons, mapId, uploadFiles, uploadIcon],
  );

  return { upload };
};

export const useIconList = () => {
  const { getIcons, delIcons: delIconsService, addIcons: addIconsService } = useService();
  const [iconList, setIconList] = useState([]);
  const {
    mapInfo: { id: mapId },
  } = useMapInfo();

  const getIconsList = useCallback(() => {
    getIcons({ mapId }).then((res) => {
      setIconList(res);
    });
  }, [getIcons, mapId]);

  useEffect(() => {
    if (mapId) {
      getIconsList();
    }
  }, [getIconsList, mapId]);

  const delIcons = useCallback(
    ({ ids }: { ids: string[] }) => {
      return delIconsService({ mapId, idList: ids });
    },
    [delIconsService, mapId],
  );

  const addIcons = useCallback(
    ({ url }: { url: string[] }) => {
      return addIconsService({ mapId, url: url });
    },
    [addIconsService, mapId],
  );

  return { iconList, delIcons, addIcons, getIconsList };
};

export const useAddLocation = () => {
  const { addLocation: addLocationService, updateDateLocation, collectTaskPosition } = useService();

  const addLocation = useCallback(
    (params: Record<string, any>) => {
      if (params?.id) {
        return updateDateLocation(params);
      }
      if (params?.taskId) {
        return collectTaskPosition(params);
      }
      return addLocationService(params);
    },
    [addLocationService, collectTaskPosition, updateDateLocation],
  );

  return { addLocation };
};

export const useGroupFieldList = () => {
  const { getGroupFieldList: getGroupFieldListService } = useService();
  const [groupFieldList, setGroupFieldList] = useState([]);

  const {
    mapInfo: { id: mapId },
  } = useMapInfo();
  const { markerLocationDetail, setMarkerLocationDetail } = useMarkerLocation();

  const getGroupFieldList = useCallback(() => {
    getGroupFieldListService().then((res) => {
      if (res?.length > 0) {
        setGroupFieldList(res);
        setMarkerLocationDetail({ ...markerLocationDetail, customFieldGroupId: res[0]?.id });
      }
    });
  }, [getGroupFieldListService, markerLocationDetail, setMarkerLocationDetail]);

  useEffect(() => {
    if (mapId) {
      getGroupFieldList();
    }
  }, [getGroupFieldList, mapId]);

  return { groupFieldList };
};

export const useGroupFields = () => {
  const { getGroupFields: getGroupFieldsService } = useService();
  const [groupFields, setGroupFields] = useState([]);

  const getGroupFields = useCallback(
    ({ id = '' }: { id: string }) => {
      getGroupFieldsService({ id }).then((res) => {
        setGroupFields(res);
      });
    },
    [getGroupFieldsService],
  );

  return { groupFields, getGroupFields };
};

export const usePositionDetail = () => {
  const {
    getPositionDetail: getPositionDetailService,
    deletePosition: deletePositionService,
    getShopDetail: getShopDetailService,
    getCoopetitionDetail: getCoopetitionDetailService,
  } = useService();
  const [detail, setDetail] = useState<Record<string, any>>({});

  const getPositionDetail = useCallback(
    ({ id = '', type }: { id: string; type: number }) => {
      if (type === 1) {
        getPositionDetailService(id).then((res) => {
          setDetail(res);
        });
      }
      if (type === 2) {
        getShopDetailService(id).then((res) => {
          setDetail(res);
        });
      }
      if (type === 3) {
        getCoopetitionDetailService({ id }).then((res) => {
          setDetail(res);
        });
      }
    },
    [getCoopetitionDetailService, getPositionDetailService, getShopDetailService],
  );

  const deletePosition = useCallback(
    ({ id = '' }: { id: string }) => {
      return deletePositionService(id);
    },
    [deletePositionService],
  );

  return { detail, getPositionDetail, deletePosition };
};

export const useCreateUserList = ({ isPageable, type }: { isPageable: boolean; type: string }) => {
  const { getCreateUserList, getShopCreateUser } = useService();
  const {
    mapInfo: { id: mapId },
  } = useMapInfo();

  const { createUserList, createUserShopList, setCreateUserShopList, setCreateUserList } = useSearchInfo();

  useEffect(() => {
    if (type === 'position') {
      getCreateUserList({
        mapId,
        isPageable,
      }).then((res) => {
        setCreateUserList(res);
      });
    }

    if (type === 'shop') {
      getShopCreateUser().then((res) => {
        setCreateUserShopList(res);
      });
    }
  }, [
    createUserList?.length,
    createUserShopList?.length,
    getCreateUserList,
    getShopCreateUser,
    isPageable,
    mapId,
    setCreateUserList,
    setCreateUserShopList,
    type,
  ]);

  return {
    createUserList,
    createUserShopList,
  };
};

export const useCountWithAdLevel = () => {
  const { getCountByAdLevel } = useService();
  const [positionCounts, setPositionCounts] = useState<any[]>([]);
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
    [mapId, position, poiPositionRequest, shopPositionRequest],
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

  const get = useCallback(
    ({ adLevel }: { adLevel: 0 | 1 | 2 }) => {
      if (mapId) {
        setPositionCounts([]);
        getCountByAdLevel({
          mapId,
          adLevel,
          ...data,
        }).then((res) => {
          setPositionCounts(res?.positionCounts ?? []);
        });
      }
    },
    [mapId, getCountByAdLevel, data],
  );

  return {
    positionCounts,
    get,
  };
};

export const useSearchField = ({ type }: any) => {
  const { getSearchField } = useService();
  const { searchFields, setSearchFields, searchShopFields, setSearchShopFields, searchPoiFields, setSearchPoiFields } =
    useSearchInfo();

  useEffect(() => {
    if (type === 'position') {
      getSearchField({ positionType: 1 }).then((res) => {
        setSearchFields([...positionSearchFields, ...res]);
      });
    }
    if (type === 'shop') {
      getSearchField({ positionType: 2 }).then((res) => {
        setSearchShopFields([...shopSearchFields, ...res]);
      });
    }
    if (type === 'poi') {
      getSearchField({ positionType: 3 }).then((res) => {
        setSearchPoiFields([...res]);
      });
    }
  }, [getSearchField, setSearchFields, setSearchPoiFields, setSearchShopFields, type]);

  return { searchFields, searchShopFields, searchPoiFields };
};

type DataType = {
  id: number;
  parentId: number;
  level?: number;
  name?: string;
};

export const processData = (data: DataType[], parentId: number): DataType[] => {
  const levelMap: Map<number, number> = new Map();

  const computeLevels = () => {
    const getLevel = (id: number): number => {
      if (levelMap.has(id)) {
        return levelMap.get(id) as number;
      }
      const parent = data.find((item) => item.id === id);
      const level = parent ? getLevel(parent.parentId) + 1 : 0;
      levelMap.set(id, level);
      return level;
    };

    data.forEach((item) => {
      if (!levelMap.has(item.id)) {
        getLevel(item.id);
      }
    });
  };

  computeLevels();

  const processedData = data.map((item) => ({
    ...item,
    level: levelMap.get(item.id) as number,
  }));

  return processedData.filter((item) => item.parentId === parentId);
};

export const useProvinceCityArea = () => {
  const { getProvinceCityArea } = useService();

  const [provinceCityArea, setProvinceCityArea] = useState<any[]>([]);

  useEffect(() => {
    getProvinceCityArea().then((res) => {
      setProvinceCityArea(res);
    });
  }, [getProvinceCityArea]);

  return { provinceCityArea };
};

export const usePoiList = () => {
  const { getPoiList } = useService();

  const [poiList, setPoiList] = useState<any[]>([]);

  useEffect(() => {
    getPoiList().then((res) => {
      setPoiList(res);
    });
  }, [getPoiList]);

  return { poiList };
};

export const useCustomFieldGroupDetail = (groupId: any) => {
  const { getCustomFieldGroupDetail } = useService();

  const [customFieldGroupDetail, setCustomFieldGroupDetail] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!groupId) {
      return;
    }
    setLoading(true);
    getCustomFieldGroupDetail(groupId)
      .then((res) => {
        setCustomFieldGroupDetail(res);
      })
      .catch((error) => {
        console.log(error, ' error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [getCustomFieldGroupDetail, groupId]);
  return { customFieldGroupDetail, loading };
};
