import { LatLng, MapView } from '@tastien/react-native-amap3d';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootParams } from '@/src/navigation';

export type KeywordOption = string | '';
export type PanelOption = 'main' | 'pointCount' | 'importStyle' | 'importGroup';
export type MapOption = Record<string, any>;
export type ImportTypeOption = 'all' | 'part' | null;

export type AreaOption = {
  code?: any;
  name?: string;
  latitude?: number;
  longitude?: number;
};

export type RouteProps = NativeStackScreenProps<RootParams, 'ExpandPunter'>;

export interface expandMap {
  location: any;
  mapViewRef: React.RefObject<MapView>;
  positionList: Record<string, any>;
}
export type RequestParamState = {
  panel?: string;
  location?: LatLng;
  selectedCity: AreaOption;
  selectedArea: Record<string, any>[];
  cityAreaList: MapOption[];
  importType?: ImportTypeOption;
  areaCode: string[];
  keyword?: KeywordOption;
  color: number[];
  groupId?: string | number;
  groupName: string;
  icon?: string;
  mapId?: number;
  searchPointList?: MapOption[];
  searchPointCount?: number;
  selectedPointData?: MapOption[];
  selectedPointId: number[];
  pageNumber?: number;
  punterPointList?: MapOption[];
  poiList?: MapOption[];
};

export type BatchExpandInfoState = RequestParamState & {
  setPanel: (panel: PanelOption) => void;
  setLocation: (location: LatLng) => void;
  setSelectedCity: (selectedCity: AreaOption) => void;
  setSelectedArea: (selectedArea: Record<string, any>[]) => void;
  setCityAreaList: (cityAreaList: MapOption) => void;
  setImportType: (importType: ImportTypeOption) => void;
  setAreaCode: (areaCode: string[]) => void;
  setColor: (color: number[]) => void;
  setIcon: (icon: string) => void;
  setGroupId: (groupId: string | number) => void;
  setGroupName: (groupName: string) => void;
  setKeyword: (keyword: KeywordOption) => void;
  setSearchPointList: (searchPointList: MapOption[]) => void;
  setSearchPointCount: (searchPointCount: number) => void;
  setSelectedPointData: (selectedPointList: MapOption[]) => void;
  setSelectedPointId: (selectedPointId: number[]) => void;
  setPunterPointList: (punterPointList: MapOption[]) => void;
  setPageNumber: (pageNumber: number) => void;
  setPoiList: (poiList: MapOption[]) => void;
  updateAttribute: (item: MapOption) => void;
  getAttribute: (item: any) => any;
  getPunterStore: () => RequestParamState;
  getCurrentArea: () => any;
  getAllCityArea: () => any;
  locateCurrentPosition: () => void;
  moveCurrentPosition: (mapViewRef: React.RefObject<MapView>, zoom: number) => void;
};
