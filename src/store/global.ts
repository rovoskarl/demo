import { UserStore } from './user';
import { inject, singleton } from 'tsyringe';
import { Authorization } from '@/utils/auth';
import { makeAutoObservable, runInAction } from 'mobx';
import { ApplicationRester, ApplicationResterToken } from '@/types/application';
import { HTTPClientToken } from '@/src/interfaces/client';
import { HTTPClientRepository } from '@/src/client/service';
import { NavigatorToken, ROUTER_FLAG, RootParams, RouterParams } from '@/src/navigation';
import { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import {
  ApplicationRole,
  ApplicationType,
  CustomAppRole,
  CustomParentRole,
  TDRole,
  YYRole,
  ZDRole,
  ZTUser,
} from '@/src/interfaces/role';
import { Toast, ToastToken } from '../interfaces/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dismissAlert } from '@baronha/ting';
import { parserJSON } from '../utils/tools';
import { NavigationRoute } from '@sentry/react-native/dist/js/tracing/reactnavigation';
import Config from 'react-native-config';
import { Platform } from 'react-native';

/**
 * 权限判断
 * 0、无权限 - Toast提示
 * 1、仅有拓店权限 -  [Map]
 * 2、仅有作战小队权限 - [Home, Me]
 * 3、仅有营运通权限 - [Dashboard, Me]
 * 4、有两个或以上 -> 跳转至选择页面 -> 选择1，2，3（公司员工，门店员工）
 * 5、---------------------------------
 */
@singleton()
export class GlobalStore {
  /** APP 权限 */
  applicationRole?: CustomAppRole[] = [];

  /** APP 类型 */
  applicationType?: ApplicationType;

  /** APP 应用列表 */
  applicationList: ApplicationType[] = [];

  /** APP 热更新版本号Hash */
  hotUpdateHash?: string = '';

  /** 拆分 */
  [ApplicationType.YYT]?: CustomAppRole[];

  [ApplicationType.ZZ]?: CustomAppRole[];

  [ApplicationType.TD]?: CustomAppRole[];

  [ApplicationType.CRM]?: CustomAppRole[];

  constructor(
    private _auth: Authorization,
    private _user: UserStore,
    @inject(NavigatorToken) private _nav: NavigationContainerRefWithCurrent<RouterParams>,
    @inject(ApplicationResterToken) private _rester: ApplicationRester,
    @inject(HTTPClientToken) private _http: HTTPClientRepository,
    @inject(ToastToken) private _toast: Toast,
  ) {
    makeAutoObservable(this);
  }

  /** 获取用户信息 */
  async getUserInfo(): Promise<ZTUser> {
    return await this._http.get('user/getUserInfo');
  }

  /** 权限接口 */
  async _loadAuthorizedRole(): Promise<ApplicationRole> {
    return await this._http.post(
      'workbench/privilege/all',
      { mobile: this._user.currentUser?.phone, clientType: 3 },
      { handleError: false },
    );
  }

  /** 初始化 */
  async onInit() {
    try {
      if (await this._auth.getToken()) {
        await this._getTDUserInfo();
      } else {
        const route = this._getSchemeLaunchRoute();
        if (route) {
          this._nav.resetRoot({
            index: 0,
            routes: [{ name: ROUTER_FLAG.Login }],
          });
          return;
        }
        this._nav.navigate(ROUTER_FLAG.Login);
      }
    } catch (error) {
      console.log('GlobalStore onInit Error', error);
    }
  }

  /** 存储Token信息 */
  setToken = (token: string) => {
    this._auth.setToken(token);
    this._getTDUserInfo();
  };

  /** 获取中台用户信息 */
  private _getTDUserInfo = async () => {
    try {
      const data = await this.getUserInfo();
      const { brandBaseInfos } = data;
      const brand = brandBaseInfos[0];
      runInAction(() => {
        this._user.currentUser! = {
          ...(this._user.currentUser! ?? {}),
          phone: data.mobile,
          brand,
          shUser: data,
        };
      });
      await this._user._setBrand(brand);
      await this._user._setUserMobile(data.mobile);
      await this._loadApplicationRole();
    } catch (error) {
      dismissAlert();
      console.log('GlobalStore getTDUserInfo Error', error);
    }
  };

  private formatArray = (list: (TDRole | YYRole | ZDRole)[], parentRole?: CustomParentRole): CustomAppRole[] => {
    let array: CustomAppRole[] = [];
    list.forEach((item) => {
      const isDesktopType = 'isDesktopType' in item ? item.isDesktopType : null;
      if ('childPrivilege' in item) {
        const { childPrivilege, ...rest } = item;
        array.push({
          id: rest.id,
          url: rest.url,
          name: rest.privilegeName,
          code: null,
          parentId: parentRole?.parentId,
          parentName: parentRole?.parentName,
          parentUrl: parentRole?.parentUrl,
          roleType: rest.roleType,
        });
        if (childPrivilege) {
          array = array.concat(
            this.formatArray(childPrivilege, {
              parentId: rest.id,
              parentName: rest.privilegeName,
              parentUrl: rest.url,
            }),
          );
        }
      } else if ('children' in item) {
        const { children, ...rest } = item;
        array.push({
          id: rest.id,
          url: rest.url,
          name: rest.name,
          code: 'code' in rest ? rest.code : null,
          parentId: parentRole?.parentId,
          parentName: parentRole?.parentName,
          parentUrl: isDesktopType ? ROUTER_FLAG.Dashboard : parentRole?.parentUrl,
          functionType: 'functionType' in item ? item.functionType : undefined,
          roleType: this._user.currentRole,
        });
        if (children) {
          array = array.concat(
            this.formatArray(children, { parentId: rest.id, parentName: rest.name, parentUrl: rest.url }),
          );
        }
      } else {
        array.push({
          id: item.id,
          url: item.url,
          name: 'name' in item ? item.name : item.privilegeName,
          code: 'code' in item ? item.code : null,
          parentId: parentRole?.parentId,
          parentName: parentRole?.parentName,
          functionType: 'functionType' in item ? item.functionType : undefined,
          parentUrl: isDesktopType ? ROUTER_FLAG.Dashboard : parentRole?.parentUrl,
          roleType: 'roleType' in item ? item.roleType : this._user.currentRole,
        });
      }
    });
    return array;
  };

  setApplication = (type: ApplicationType) => {
    runInAction(() => {
      this.applicationType = type;
      this.applicationRole = this[type];
    });
    if (type === ApplicationType.YYT) {
      this._user._loadAuthorizedData();
    }
    this._nav.resetRoot({
      index: 0,
      routes: [{ name: ROUTER_FLAG.Lunch }],
    });
  };

  /**
   * 整理权限数据，并根据数据跳转系统主页
   */
  private async _dataFormat(roleObject: ApplicationRole) {
    const { 1: zdRole, 2: yyRole, 3: tdRole, 4: crmRole } = roleObject;
    // 有多个权限
    const zdList = this.formatArray(zdRole);
    const yyList = this.formatArray(yyRole);
    const tdList = this.formatArray(tdRole);
    const crmList = this.formatArray(crmRole);
    const list: ApplicationType[] = [];
    if (zdRole.length) {
      list.push(ApplicationType.ZZ);
    }
    if (yyRole.length) {
      list.push(ApplicationType.YYT);
      await this._user._loadAuthorizedData();
    }
    if (tdRole.length) {
      list.push(ApplicationType.TD);
    }
    if (crmList.length && Platform.OS === 'android') {
      list.push(ApplicationType.CRM);
    }
    // 保存权限数据
    runInAction(() => {
      this.applicationList = list;
      this[ApplicationType.TD] = tdList;
      this[ApplicationType.ZZ] = zdList;
      this[ApplicationType.YYT] = yyList;
      this[ApplicationType.CRM] = crmList;
    });
    // 如果是通过其他应用唤起，根据应用权限跳转到对应的落地页面
    const route = this._getSchemeLaunchRoute();
    if (route) {
      this._handleSchemeLaunchRoute(route, list, tdList, zdList, yyList);
      return;
    }
    this._handleRoleData(roleObject, list, tdList, zdList, yyList, crmList);
  }

  private _handleRoleData(
    roleObject: ApplicationRole,
    list: ApplicationType[],
    tdList: CustomAppRole[],
    zdList: CustomAppRole[],
    yyList: CustomAppRole[],
    crmList: CustomAppRole[],
  ) {
    // 如果有多个权限，跳转到选择页面，由用户自己选择进入哪个系统
    console.log('this.getRoleLength(roleObject)', this.getRoleLength(roleObject));
    if (this.getRoleLength(roleObject) >= 2) {
      runInAction(() => {
        this.applicationList = list;
        this[ApplicationType.TD] = tdList;
        this[ApplicationType.ZZ] = zdList;
        this[ApplicationType.YYT] = yyList;
        this[ApplicationType.CRM] = crmList;
      });
      this._nav.resetRoot({
        routes: [{ name: ROUTER_FLAG.SystemSelect }],
      });
    } else if (zdList.length) {
      runInAction(() => {
        this.applicationRole = tdList;
        this.applicationType = ApplicationType.ZZ;
      });
      this._nav.resetRoot({
        index: 0,
        routes: [{ name: ROUTER_FLAG.Lunch }],
      });
    } else if (yyList.length) {
      if (this._user.roleList.length > 1) {
        this[ApplicationType.YYT] = yyList;
        this.applicationList = list;
        this._nav.resetRoot({
          routes: [{ name: ROUTER_FLAG.SystemSelect }],
        });
      } else {
        runInAction(() => {
          this.applicationRole = yyList;
          this.applicationType = ApplicationType.YYT;
        });
        this._nav.resetRoot({
          index: 0,
          routes: [{ name: ROUTER_FLAG.Lunch }],
        });
      }
    } else if (tdList.length) {
      runInAction(() => {
        this.applicationType = ApplicationType.TD;
        this.applicationRole = tdList;
      });
    } else if (crmList.length && Platform.OS === 'android') {
      runInAction(() => {
        this.applicationType = ApplicationType.CRM;
        this.applicationRole = crmList;
      });
    }
    dismissAlert();
  }

  /**
   * 获取权限数量
   */
  getRoleLength = (data: ApplicationRole) => {
    let count = 0;
    Object.values(data).forEach((values) => {
      if (Array.isArray(values) && values.length > 0) {
        count++;
      }
    });
    return count;
  };

  /** 获取APP权限 */
  _loadApplicationRole = async () => {
    try {
      const data = await this._loadAuthorizedRole();
      if (!this.getRoleLength(data)) {
        this._toast.show('暂无权限');
        AsyncStorage.clear();
        dismissAlert();
        this.reset();
        return;
      }
      this._dataFormat(data);
    } catch (error) {
      dismissAlert();
      console.log('GlobalStore _loadApplicationRole Error', error);
    }
  };

  reset = () => {
    // 清除保存的记录
    runInAction(() => {
      this.applicationRole = [];
      this.applicationType = undefined;
      this.applicationList = [];
      this[ApplicationType.TD] = [];
      this[ApplicationType.ZZ] = [];
      this[ApplicationType.YYT] = [];
      this[ApplicationType.CRM] = [];
      this._user.roleList = [];
      this.hotUpdateHash = '';
    });
    this._user.resetUser();
  };

  /** 退出登录 */
  logout = async () => {
    try {
      this._rester.reset();
      // 清除保存的记录
      this.reset();
      // this._tracker.reset();
    } catch (error) {
      console.log('UserStore logout Error', error);
    }
  };

  private _getSchemeLaunchRoute() {
    const route = this._nav.getCurrentRoute();
    if (route?.name === ROUTER_FLAG.SchemeLaunch) {
      return route.params! as RootParams[typeof ROUTER_FLAG.SchemeLaunch];
    }
  }

  private _handleSchemeLaunchRoute(
    route: RootParams[typeof ROUTER_FLAG.SchemeLaunch],
    list: ApplicationType[],
    tdList: CustomAppRole[],
    zdList: CustomAppRole[],
    yyList: CustomAppRole[],
  ) {
    const appType = ApplicationType[route.applicationType as unknown as keyof typeof ApplicationType];
    const hasApplicationPermission = list.includes(appType);

    console.log('handleSchemeLaunchRoute start', hasApplicationPermission, route, appType);
    // 没有权限，退出登录
    if (!hasApplicationPermission) {
      this._toast.show('暂无权限');
      this.logout();
      return;
    }
    // 手机号不一致，退出登录
    const params = parserJSON(route.params ?? '') || {};
    if (params.mobile && params.mobile !== this._user.currentUser?.phone) {
      this._toast.show('暂无权限');
      this.logout();
      return;
    }

    runInAction(() => {
      this.applicationType = appType;
      this.applicationList = list;
      this[ApplicationType.TD] = tdList;
      this[ApplicationType.ZZ] = zdList;
      this[ApplicationType.YYT] = yyList;
      this.applicationRole = this[appType];
    });
    let routers: Omit<NavigationRoute, 'key'>[] = [{ name: ROUTER_FLAG.Lunch }];
    if (route.routeFlag) {
      console.log('handleSchemeLaunchRoute route params', params);
      // 处理url参数，如果带有请求协议直接跳转到对应的页面，否者拼接上作战小队的webview ulr
      let url = params.url;
      if (url && url.startsWith('http')) {
        params.url = url;
      } else if (url) {
        params.url = `${Config.APP_ZZ_WEBVIEW_URL}#${url}`;
      }
      routers = [{ name: ROUTER_FLAG.Main }, { name: route.routeFlag, params }];
    }

    this._nav.resetRoot({
      index: 0,
      routes: routers,
    });
  }

  handleSchemeLaunch() {
    const route = this._getSchemeLaunchRoute();
    if (route) {
      this._handleSchemeLaunchRoute(
        route,
        this.applicationList,
        this[ApplicationType.TD]!,
        this[ApplicationType.ZZ]!,
        this[ApplicationType.YYT]!,
      );
    }
  }

  /**热更新已下载版本Hash */
  setHotUpdateHash = (hash: string) => {
    this.hotUpdateHash = hash;
  };
}
