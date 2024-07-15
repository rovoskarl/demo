export interface CustomAppRole {
  id: number;
  parentId?: number;
  parentName?: string;
  parentUrl?: string;
  url: string;
  name: string;
  code: string | null;
  isDesktopType?: number | null;
  functionType?: number | null;
  roleType?: 'CORP' | 'SHOP';
}

export interface CustomParentRole {
  parentId: number;
  parentUrl: string;
  parentName: string;
}

export interface YYRole {
  id: number;
  privilegeName: string;
  privilegeType: number;
  url: string;
  parentId: number;
  systemType: number;
  hasResourceScope: boolean;
  roleScopeType: string;
  roleType: 'CORP' | 'SHOP';
  childPrivilege?: YYRole[];
}

export interface TDRole {
  id: number; // 权限id
  parentId: number; // 父级权限id
  name: string; // 权限名称
  url: string; // 权限对应的url
  bizType: number; // 业务类型
  clientType: number;
  functionType: number | null; // 1：目录 2：页面 3：按钮
  remark: string | null; // 备注
  shCreateTime: number; // 创建时间
  shUpdateTime: number; // 更新时间
  orderNum: number; // 排序
  showStatus: number; // 是否显示 0: 显示 1: 不显示
  iconUrl: string | number; // 图标
  bankBind: number | number;
  order: number; // 排序
  link: number; // APP跳转链接
  isDesktopType: number; // 是否加入工作台 0: 是 1: 否
  children?: TDRole[];
}
export interface ZDRole {
  id: number; // 权限id
  parentId: number; // 父级权限id
  name: string; // 权限名称
  levels: number; // 按钮级别
  ismenu: string; // 按钮级别（Y，N）
  num: number; // 排序
  url: string; // 权限对应的url
  icon?: any; // 图标
  code: string; // 权限编码
  children?: any; // 子级权限
  linkedList: any[]; // 查询子节点的时候的临时集合
}
export interface ApplicationRole {
  1: ZDRole[]; //
  2: YYRole[];
  3: TDRole[];
  4: TDRole[];
}

export enum ApplicationType {
  'ZZ',
  'TD',
  'YYT',
  'CRM',
}

export const ApplicationTypeName = {
  [ApplicationType.ZZ]: '作战小队',
  [ApplicationType.YYT]: '营运通',
  [ApplicationType.TD]: '拓店小队',
  [ApplicationType.CRM]: '通话助手',
};

export interface ZTUser {
  shUserId: number;
  userName: string;
  userType: number;
  mobile: string;
  nickName: string;
  brandBaseInfos: BrandBaseInfo[];
  privilegeUrls: any[];
  extShopInfos: ExtShopInfo[];
}

interface ExtShopInfo {
  name: string;
  value: string;
  key: string;
  type: string;
  props: Props;
}

interface Props {
  placeholder: string;
  maxLength: string;
}

interface BrandBaseInfo {
  brandId: number;
  brandName: string;
  wsFranchiseeInfoList?: any;
  isFranchisee: boolean;
}
