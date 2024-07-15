import { inject, singleton } from 'tsyringe';
import { makeAutoObservable, runInAction } from 'mobx';
import { HTTPClientToken } from '@/src/interfaces/client';
import { StorageToken, StorageType } from '@/src/interfaces/storage';
import { HTTPClientRepository } from '@/client/service';
import { ZTUser } from '@/src/interfaces/role';

interface ApplicationUser {
  admin?: boolean;
  avatar: string;
  corpId: number;
  corpName: string;
  corpRoleList: RoleList[];
  name: string;
  phone: string;
  resignationStatus: number;
  roleList: RoleList[];
  shopRoleList: RoleList[];
  shopManager: boolean;
  userId: number;
  userName: string;
  mobile?: string;
  brand?: ZTUser['brandBaseInfos'][number];
  shUser?: shUser;
}

interface shUser {
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

interface RoleList {
  roleId: number;
  roleName?: string;
  roleCode: string;
}

export type Role = 'SHOP' | 'CORP';

@singleton()
export class UserStore {
  currentUser?: ApplicationUser = undefined;

  currentRole: Role = 'CORP';

  roleList: Role[] = [];

  private static _MOBILE_KEY = '_APPLICATION_USER_MOBILE__V1.0';

  static _IDENTIFY_KEY = '_APPLICATION_USER_IDENTIFY__V1.0';

  static _BRAND_KEY = '_APPLICATION_USER_BRAND__V1.0';

  constructor(
    @inject(StorageToken) private _storage: StorageType,
    @inject(HTTPClientToken) private _http: HTTPClientRepository,
  ) {
    makeAutoObservable(this);
    this._getIdentify();
  }

  get userWatermarkText() {
    // 兼容逻辑
    const name = this.currentUser?.name ?? this.currentUser?.shUser?.nickName ?? '';
    return name ? `${name} ${this.currentUser?.phone?.slice(-4) ?? ''}` : '';
  }

  /**
   * 获取本地存储的用户身份
   */
  async _getIdentify() {
    try {
      const identify: Role | null = await this._storage.getItem(UserStore._IDENTIFY_KEY);
      runInAction(() => {
        this.currentRole = identify ?? 'CORP';
      });
    } catch (error) {
      console.log('UserStore to getIdentify error', error);
    }
  }

  /**
   * 获取手机号和品牌信息
   */
  async _getUserMobile() {
    const mobile: string | null = await this._storage.getItem(UserStore._MOBILE_KEY);
    const brand: ZTUser['brandBaseInfos'][number] | null = await this._storage.getItem(UserStore._BRAND_KEY);
    runInAction(() => {
      this.currentUser = {
        ...this.currentUser!,
        phone: mobile ?? '',
        brand: brand ?? undefined,
      };
    });
  }

  /**
   * 存储品牌信息
   */
  async _setBrand(brand: ZTUser['brandBaseInfos'][number]) {
    await this._storage.setItem(UserStore._BRAND_KEY, brand);
  }

  /** 存储用户手机号信息 */
  async _setUserMobile(mobile: string) {
    await this._storage.setItem(UserStore._MOBILE_KEY, mobile);
  }

  /** 获取营运通的用户信息 */
  getUserDetail = async (): Promise<ApplicationUser> => {
    const data: ApplicationUser = await this._http.post('yy/user/getUserDetail', { handleError: false });
    return data;
  };

  /** 获取用户信息 */
  async _loadAuthorizedData() {
    try {
      const userDto = await this.getUserDetail();
      runInAction(() => {
        this.currentUser = {
          ...this.currentUser!,
          ...userDto,
        };
      });
      this._loadUserRole(userDto);
    } catch (error) {
      console.log('UserStore to _loadAuthorizedData error', error);
    }
  }

  /**
   * 营运通选择角色权限
   */
  async _loadUserRole(user: ApplicationUser) {
    const { corpRoleList, shopRoleList } = user;
    if (corpRoleList?.length && shopRoleList?.length) {
      runInAction(() => {
        this.roleList = ['CORP', 'SHOP'];
      });
    } else {
      runInAction(() => {
        this.roleList = shopRoleList?.length ? ['SHOP'] : ['CORP'];
      });
      this.setCurIdentify(shopRoleList?.length ? 'SHOP' : 'CORP');
    }
  }

  /** 选择角色权限 */
  setCurIdentify = async (roleType: Role) => {
    await this._storage.setItem(UserStore._IDENTIFY_KEY, roleType);
    runInAction(() => {
      this.currentRole = roleType;
    });
  };

  /**
   * 退出登录，清空用户信息
   */
  resetUser = () => {
    runInAction(() => {
      this.currentUser = undefined;
    });
  };
}
