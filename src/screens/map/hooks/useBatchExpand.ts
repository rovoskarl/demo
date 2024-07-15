import { init, Geolocation } from 'react-native-amap-geolocation';
import { MapView, LatLng } from '@tastien/react-native-amap3d';
import { create } from 'zustand';
import { assign } from 'lodash-es';
import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { MapOption, AreaOption, RouteProps, BatchExpandInfoState } from '../definition/expandDefinition';
import { getOptionValue } from '../../../utils/tools';
import { MAP_KEY_IOS, MAP_KEY_WEB } from '../constant/constants';
import { areaDataList } from '../expandPunterCityData';
import { useService, useMapInfo, useRenderType } from './index';
import { useDependency } from '@/src/ioc';
import { ROUTER_FLAG, ScreenNavigationProp } from '@/src/navigation';
import { Toast, ToastToken } from '@/src/interfaces/notifications';

export const useExpandPunter = () => {
  const {
    location,
    selectedCity,
    selectedArea,
    setPanel,
    setColor,
    setIcon,
    setGroupId,
    setSearchPointList,
    setSearchPointCount,
    setPageNumber,
    setPunterPointList,
    setCityAreaList,
    setLocation,
    setKeyword,
    setSelectedCity,
    setSelectedPointId,
    getPunterStore,
    getCurrentArea,
  } = useBatchExpand();
  const {
    mapInfo: { id: mapId },
  } = useMapInfo();
  const toast = useDependency<Toast>(ToastToken);
  const { batchImportExpandPointer } = useService();
  const navigation = useNavigation<ScreenNavigationProp>();
  const route = useRoute<RouteProps['route']>();
  const { update } = useRenderType();

  /**
   * @method      refreshCityLocationByCoor
   * @description 切换城市自动定位
   * @param name
   */
  const refreshCityLocationByCoor = useCallback(
    async (mapViewRef: React.RefObject<MapView>) => {
      if (!location || Object.keys(location).length === 0) {
        return false;
      }
      const { longitude, latitude }: any = location;
      fetch(`https://restapi.amap.com/v3/geocode/regeo?key=${MAP_KEY_WEB}&location=${longitude},${latitude}`)
        .then((response) => response.json())
        .then((data) => {
          const successFlag = data.status === '1' && data.info === 'OK';
          const geocodes = successFlag ? data?.regeocode?.addressComponent : {};
          try {
            const { city, adcode } = geocodes;
            if (successFlag) {
              setSelectedCity({ code: adcode, name: city });
              mapViewRef.current?.moveCamera(
                {
                  tilt: 45,
                  bearing: 90,
                  zoom: 8,
                  target: { latitude: latitude, longitude: longitude },
                },
                10000,
              );
            }
          } catch (err) {}
        })
        .catch((error) => {
          console.error(error);
        });
    },
    [location, setSelectedCity],
  );
  /**
   * @method      refreshCityLocationByName
   * @description 切换城市自动定位
   * @param name
   */
  const refreshCityLocationByName = useCallback(
    async (name: string | undefined) => {
      if (!name) {
        return false;
      }
      fetch(`https://restapi.amap.com/v3/geocode/geo?key=${MAP_KEY_WEB}&address=${name}&city=${name}`)
        .then((response) => response.json())
        .then((data) => {
          const isTrue = data.status === '1' && data.info === 'OK';
          const geocodes = isTrue ? data.geocodes : [];
          console.log('geocodes', geocodes);
          try {
            const lang = geocodes[0]?.location?.split(',');
            const currentLocaztion = {
              latitude: parseFloat(lang[1]),
              longitude: parseFloat(lang[0]),
            };
            if (isTrue) {
              setLocation(currentLocaztion);
              navigation.navigate(ROUTER_FLAG.ExpandPunter, {
                action: 'locate',
                panel: 'main',
                data: {
                  location: currentLocaztion,
                },
              });
            }
          } catch (err) {}
        })
        .catch((error) => {
          console.error(error);
        });
    },
    [navigation, setLocation],
  );

  /**
   * @method      queryCityAreaList
   * @description 获取城市区域
   */
  const queryCityAreaList = useCallback(async () => {
    if (selectedCity?.code) {
      const currentZoneList = getOptionValue(areaDataList, selectedCity?.code);
      const defaultArea = [{ code: '', name: '全部区域' }];
      setCityAreaList(currentZoneList ? defaultArea.concat(currentZoneList) : []);
    }
  }, [selectedCity, setCityAreaList]);

  async function fetchPostData(url: string): Promise<any> {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  /**
   * @method            handleSearchPoint
   * @description       查询地图点位数据汇总
   * @param keyword
   */
  const handleSearchMultiPoint = useCallback(
    async (keyword: string | undefined, pageNumber: number, resolve: Function) => {
      if (!keyword) {
        return false;
      }
      setKeyword(keyword);
      console.log('selectedArea', selectedArea);
      async function fetchMultiPosts(): Promise<Array<any>> {
        let promises: any = [];
        if (selectedArea?.length > 0) {
          promises = selectedArea.map((item: any) =>
            fetchPostData(
              `https://restapi.amap.com/v3/place/text?offset=25&page=${pageNumber}&city=${item.code}&key=${MAP_KEY_WEB}&keywords=${keyword}&extensions=all`,
            ),
          );
        } else {
          promises.push(
            fetchPostData(
              `https://restapi.amap.com/v3/place/text?offset=25&page=${pageNumber}&city=${selectedCity?.code}&key=${MAP_KEY_WEB}&keywords=${keyword}&extensions=all`,
            ),
          );
        }
        return Promise.all(promises);
      }

      fetchMultiPosts()
        .then((response) => {
          let pointList: any[] = [];
          let multiCount: number = 0;
          response.forEach((data) => {
            const successFlag = data.status === '1' && data.info === 'OK';
            if (successFlag) {
              pointList = successFlag ? pointList.concat(data.pois) : pointList;
              multiCount += Number(data.count);
            }
          });
          resolve({
            pageNumber: pageNumber,
            count: multiCount,
            pointer: pointList,
          });
        })
        .catch((error) => {
          console.error(error);
          resolve({
            count: 0,
            pointer: [],
          });
        });
    },
    [setKeyword, selectedArea, selectedCity],
  );

  /**
   * @method            handleSearchPoint
   * @description       查询地图点位
   * @param keyword
   */
  const handleSearchPoint = useCallback(
    async (keyword: string | undefined, pageNumber: number, resolve: Function) => {
      const { code }: AreaOption = getCurrentArea();
      if (!keyword) {
        return false;
      }
      setKeyword(keyword);
      fetch(
        `https://restapi.amap.com/v3/place/text?offset=25&page=${pageNumber}&city=${code}&key=${MAP_KEY_WEB}&keywords=${keyword}&extensions=all`,
      )
        .then((response) => response.json())
        .then((data) => {
          const successFlag = data.status === '1' && data.info === 'OK';
          if (successFlag) {
            const pointContent = successFlag ? data.pois : [];
            resolve({
              pageNumber: pageNumber,
              count: data.count,
              pointer: pointContent,
            });
          }
        })
        .catch((error) => {
          console.error(error);
          resolve({
            count: 0,
            pointer: [],
          });
        });
    },
    [setKeyword, getCurrentArea],
  );

  /**
   * @method        batchPunterImport
   * @description   批量导入
   */
  const batchPunterImport = useCallback(
    async (closeLoading: Function) => {
      const { code } = getCurrentArea();
      const { importType, keyword, color, groupId, icon, poiList } = getPunterStore();
      console.log('getPunterStore===', importType, keyword, color, groupId, icon, poiList);

      let requestParam: Record<string, any> = {
        mapId,
        areaCode: code,
        keyword,
        groupId,
        icon,
        adCode: code,
      };

      if (importType === 'part') {
        requestParam.poiList = poiList;
      }
      requestParam.keyword = keyword === undefined ? '' : keyword;
      requestParam.color = color?.length ? color?.[0] : 1;
      console.log(requestParam, 'requestParam');
      batchImportExpandPointer(requestParam)
        .then(() => {
          setPanel('main');
          setColor([1]);
          setIcon('');
          setGroupId('');
          setSelectedPointId([]);
          closeLoading && closeLoading();

          update('home');
        })
        .catch((e) => {
          console.log('error', e);
          closeLoading && closeLoading();
        });

      console.log('requestParam', requestParam);
    },
    [
      getCurrentArea,
      getPunterStore,
      mapId,
      batchImportExpandPointer,
      setPanel,
      setColor,
      setIcon,
      setGroupId,
      setSelectedPointId,
      update,
    ],
  );

  /**
   * @method      handleSelectCity
   */
  const handleSelectCity = useCallback(
    async (cityItem: any) => {
      await refreshCityLocationByName(cityItem.name);
      setSelectedCity(cityItem);
      setCityAreaList([]);
    },
    [setCityAreaList, setSelectedCity, refreshCityLocationByName],
  );

  /**
   * @method        setPunterPointData
   * @param { count, pointer, pageNumber}
   */
  const setPunterPointData = useCallback(
    ({ count, pointer, pageNumber }: { count: number; pointer: any[]; pageNumber: number }) => {
      if (pageNumber === 1) {
        setSearchPointList(pointer);
        setPunterPointList(pointer);
        setSearchPointCount(count);
      } else {
        const { punterPointList } = getPunterStore();
        if (punterPointList && pointer.length) {
          setPunterPointList(punterPointList?.concat(pointer));
        }
      }
    },
    [getPunterStore, setPunterPointList, setSearchPointCount, setSearchPointList],
  );

  /**
   * @method          handleKeywordChange
   * @description     多区域搜索点位
   */
  const handleKeywordChange = (content: string) => {
    if (!content) {
      setSearchPointCount(0);
      setPanel('main');
      return;
    }
    handleSearchMultiPoint(content, 1, (response: { count: number; pointer: any[]; pageNumber: number }) => {
      setPunterPointData({ ...response });
      const { count } = response;
      setPanel(count > 0 ? 'pointCount' : 'main');
    });
  };

  /**
   * @method    refreshExpandPoint
   * @description     多区域搜索点位
   */
  const refreshExpandPoint = useCallback(
    async (keyword: string) => {
      console.log('refreshExpandPoint', keyword);
      setPageNumber(1);
      handleSearchPoint(keyword, 1, (response: { count: number; pointer: any[]; pageNumber: number }) => {
        setPunterPointData({ ...response });
      });
    },
    [setPageNumber, setPunterPointData, handleSearchPoint],
  );

  /**
   * @method              loadExpandPoint
   * @param pageNumber
   */
  const loadExpandPoint = useCallback(
    async (keyword: string) => {
      let { pageNumber } = getPunterStore();
      console.log('loadExpandPoint', pageNumber, keyword);
      if (!pageNumber) {
        pageNumber = 1;
        setPageNumber(1);
      }
      const currentPage = pageNumber + 1;
      setPageNumber(currentPage);
      handleSearchPoint(keyword, currentPage, (response: { count: number; pointer: any[]; pageNumber: number }) => {
        const { pointer } = response;
        if (pointer.length) {
          setPunterPointData({ ...response });
        } else {
          toast.show('暂无更多数据');
        }
      });
    },
    [toast, getPunterStore, setPunterPointData, setPageNumber, handleSearchPoint],
  );

  return {
    refreshCityLocationByName,
    refreshCityLocationByCoor,
    queryCityAreaList,
    handleKeywordChange,
    refreshExpandPoint,
    loadExpandPoint,
    handleSelectCity,
    batchPunterImport,
    navigation,
    route,
  };
};

export const useBatchExpand = create<BatchExpandInfoState>((set, get) => ({
  // main-首页 pointCount-目标点位统计 importStyle-导入样式
  panel: 'main',
  location: { longitude: 119.296411, latitude: 26.074286 },
  selectedCity: { code: '350100', name: '福州' },
  selectedArea: [],
  cityAreaList: [],
  importType: null,
  areaCode: [],
  color: [1],
  groupId: '',
  groupName: '',
  icon: '',
  keyword: '',
  mapId: 0,
  // 查询点位
  searchPointList: [],
  searchPointCount: 0,
  pageNumber: 1,
  selectedPointData: [],
  selectedPointId: [],
  // 分页点位
  punterPointList: [],
  // 已选点位
  poiList: [],
  setPanel: (panel: string) => {
    set({
      panel: panel,
    });
  },
  setLocation: (location: LatLng) => {
    set({ location });
  },
  setSelectedCity: (selectedCity: MapOption) => {
    set({ selectedCity });
  },
  setSelectedArea: (selectedArea: MapOption[]) => {
    set({ selectedArea });
  },
  setCityAreaList: (cityAreaList: any) => {
    set({ cityAreaList });
  },
  setImportType: (importType: any) => {
    set({ importType });
  },
  setAreaCode: (areaCode: any) => {
    set({ areaCode });
  },
  setColor: (color: number[]) => {
    set({ color });
  },
  setIcon: (icon: string) => {
    set({ icon });
  },
  setGroupId: (groupId: string | number) => {
    set({ groupId });
  },
  setGroupName: (groupName: string) => {
    set({ groupName });
  },
  setKeyword: (keyword: any) => {
    set({ keyword });
  },
  setSearchPointList: (searchPointList: MapOption[]) => {
    set({ searchPointList });
  },
  setSearchPointCount: (searchPointCount: number) => {
    set({ searchPointCount });
  },
  setSelectedPointData: (selectedPointData: MapOption[]) => {
    set({ selectedPointData });
  },
  setSelectedPointId: (selectedPointId: number[]) => {
    set({ selectedPointId });
  },
  setPageNumber: (pageNumber: number) => {
    set({ pageNumber });
  },
  setPunterPointList: (punterPointList: MapOption[]) => {
    set({ punterPointList });
  },
  setPoiList: (poiList: MapOption[]) => {
    set({ poiList });
  },
  updateAttribute: (item: MapOption) => {
    set((state) => assign(state, { ...item }));
  },
  getPunterStore: () => {
    const state = get();
    return state;
  },
  getAttribute: (item: any) => {
    const state = get();
    if (Object.keys(state).includes(item)) {
      return getOptionValue(state, item) || '';
    }
    return '';
  },
  locateCurrentPosition: async () => {
    await init({
      ios: MAP_KEY_IOS,
      android: MAP_KEY_WEB,
    });
    Geolocation.getCurrentPosition(({ coords }) => {
      console.log(coords);
      set({
        location: { latitude: coords.latitude, longitude: coords.longitude },
      });
    });
  },
  moveCurrentPosition: async (mapViewRef: React.RefObject<MapView>, zoom: number) => {
    const { location } = get();
    const { longitude, latitude }: any = location;
    if (mapViewRef?.current) {
      mapViewRef?.current?.moveCamera(
        {
          zoom: zoom || 18,
          target: { longitude: longitude, latitude: latitude },
        },
        1000,
      );
    } else {
      console.log('地图实例不存在');
    }
  },
  getCurrentArea: () => {
    return { ...get().selectedCity, ...get().selectedArea[0] };
  },
  getAllCityArea: () => {
    const area = get().selectedArea;
    if (!area || area.length === 0) {
      return [get().selectedCity];
    }
    return get().selectedArea;
  },
}));
