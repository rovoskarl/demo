import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationType } from '../interfaces/role';

export interface Tab {
  name: string;
  component: () => React.JSX.Element;
  options?: BottomTabNavigationOptions;
}

export interface Router {
  show?: boolean;
  name: string;
  component: ({ route }?: any) => React.JSX.Element;
  options?: NativeStackNavigationOptions;
}

export const ROUTER_FLAG = {
  /** 启动页 */
  Lunch: 'Lunch',
  /** Tab Group */
  Main: 'Main',
  /** 首页 */
  Home: 'Home',
  /** 代办 */
  Agent: 'agent',
  /** 点位详情 */
  MapPointDetail: 'MapPointDetail',
  /** 审核 */
  Approval: 'approval',
  /** 登录页 */
  Login: 'Login',
  /** 忘记密码 */
  ForgetPassword: 'ForgetPassword',
  /** 个人中心 */
  Me: 'Me',
  /** 工作台 */
  Dashboard: 'Dashboard',
  /** 门店选择 */
  StoreSelect: 'StoreSelect',
  /** 角色选择 */
  SystemSelect: 'SystemSelect',
  /** 监控页面 */
  Video: 'Video',
  /** 设置 */
  Setting: 'Setting',
  /** 图库 */
  Gallery: 'Gallery',
  /** 图片 */
  Photos: 'Photos',
  /** 图库预览Modal */
  GalleryPreview: 'GalleryPreview',
  /** 关于 */
  About: 'About',
  /** 权限 */
  Permission: 'Permission',
  /** 一键拓客-首页 **/
  ExpandPunter: 'ExpandPunter',
  /** 一键拓客-点位列表 **/
  ExpandPunterList: 'ExpandPunterList',
  /** 一键拓客-城市列表 **/
  ExpandPunterCity: 'ExpandPunterCity',
  /** 首页点位列表管理 */
  MapPunterManage: 'MapPunterManage',
  /** 首页点位批量编辑 */
  MapPunterBatchEdit: 'MapPunterBatchEdit',
  /** 首页点位地图选择 */
  MapPunterMapSelection: 'MapPunterMapSelection',
  /** map */
  Map: 'Map',
  /** map */
  MapOperationRecord: 'MapOperationRecord',
  /** map */
  MapPositionDetail: 'MapPositionDetail',
  /** map search */
  MapSearch: 'MapSearch',
  /** 采集任务列表 */
  MapCollections: 'MapCollections',
  /** 采集任务详情 */
  MapCollectionsTaskDetail: 'MapCollectionsTaskDetail',
  /** 采集任务转派 */
  TaskDispatch: 'TaskDispatch',
  /** map mark location */
  MapMarkerLocation: 'MapMarkerLocation',
  /** map mark location info */
  MapMarkerLocationInfo: 'MapMarkerLocationInfo',
  /** map fast mark location info */
  MapFastMarkerLocation: 'MapFastMarkerLocation',
  /** map creators list */
  MapCreatorsList: 'MapCreatorsList',
  /** WebView */
  WebViewScreen: 'WebViewScreen',
  /** 地图选择 */
  MapSelection: 'MapSelection',
  /** 电话助手 */
  TelephoneScreen: 'TelephoneScreen',
  /** App唤起启动页 */
  SchemeLaunch: 'SchemeLaunch',
  /** 审核不通过 */
  ApprovalReject: 'ApprovalReject',
  /** 审核通过 */
  ApprovalPass: 'ApprovalPass',
  /** 审核驳回 */
  ApprovalTurnDown: 'ApprovalTurnDown',
} as const;

export type RouteNames = (typeof ROUTER_FLAG)[keyof typeof ROUTER_FLAG];

/**
 * 路由跳转携带的参数，默认为undefined
 */
export type RouterParams = {
  [key in RouteNames]: Record<string, any> | undefined;
};

export type RootParams = {
  [ROUTER_FLAG.Video]: { shopId: number };
  [ROUTER_FLAG.Photos]: { folderName: string };
  [ROUTER_FLAG.GalleryPreview]: { id: string; onRefresh?: () => void };
  [ROUTER_FLAG.WebViewScreen]: { url: string; title?: string };
  [ROUTER_FLAG.ExpandPunter]: {
    action?: string;
    panel?: null | 'main' | 'pointCount' | 'importStyle';
    data?: Record<string, any>;
  };
  [ROUTER_FLAG.ExpandPunterList]: { pointList: Record<string, any>[] };
  [ROUTER_FLAG.StoreSelect]: { shopName?: string };
  [ROUTER_FLAG.SchemeLaunch]: {
    routeFlag?: string;
    applicationType?: ApplicationType;
    /** 跳转参数的JSON字符串，经过url encode处理 */
    params?: string;
  };
  [ROUTER_FLAG.MapSelection]: {
    /** 是否为选择地图 */
    isSelectMap?: boolean;
    /** 是否选择地图完毕 */
    isSelectMapFinish?: boolean;
    /** 地图相关信息 */
    mapInfo?: { name: string; address: string; location: string };
  };
};

export type ScreenNavigationProp = StackNavigationProp<RouterParams>;
