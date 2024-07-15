import crypto from 'crypto-js';
import DeviceInfo from 'react-native-device-info';
import { HTTPClientRepository } from '@/src/client/service';
import { HTTPClientToken } from '@/src/interfaces/client';
import { singleton, inject } from 'tsyringe';
import { Platform } from 'react-native';

export type User = {
  userName: string | number; //账号名称
  userId: number; //账号ID
  corpId: number; //公司ID
  freeze: boolean; //账号是否被冻结
  phone: string; //手机号码
};

export type LoginByAccountParams = Pick<User, 'userName'> & {
  password: string; //密码
  imageCode: string; //图形验证码
  imageKey: string; //后端对应图形验证码的唯一key
  plat: string; //平台
};

//获取手机验证码
export type MobileVerificationParams = Pick<User, 'phone'> & {
  imageCode?: string; //图形验证码
  imageKey?: string; //后端对应图形验证码的唯一key
  smsTypeEnum: string;
};

//登录平台
export enum LoginOsEnum {
  PC = 0,
  ios = 1,
  Android = 2,
}

// 登录渠道
export enum LoginChannelEnum {
  经营中台 = 0,
  塔塔门店助手 = 1,
  门店通 = 2,
  塔狮小程序 = 3,
  ERP系统 = 4,
  智慧门店 = 5,
  塔塔工作台 = 6,
}

// 登录方式
export enum LoginMannerEnum {
  password = 0,
  sms = 1,
  weChatAuthorization = 2,
}

export type LoginParams = {
  mobile?: string; //手机号
  securityCode?: string; //手机验证码
  loginOs?: LoginOsEnum; // 登录平台
  loginChannel?: LoginChannelEnum; // 登录业务系统
  loginManner: LoginMannerEnum;
  loginType?: 'PWD_LOGIN' | 'SMS_LOGIN'; //登录类型
  smsTypeEnum?:
    | 'LOGIN'
    | 'UPDATE_PWD'
    | 'TASTIEN_LOGIN'
    | 'PRINCIPAL_LOGIN'
    | 'ALI_BANK_LOGIN'
    | 'SMART_STORE_SMS_LOGIN'
    | 'ERP_SUPPLY_USER_CREATE'; //短信类型
  systemCode?: number; //系统编码
  uniqueCode?: string; //唯一编码
  nickName?: string; //昵称
  password?: string; //密码
  userId?: number; //用户ID
  username?: string;
  checkCodeKey?: string;
  checkCode?: string;
};

type roleListType = {
  roleCode: 'PATROL_SUPER' | 'PATROL_SUPER_SUPERVISION' | 'PATROL_SUPERVISION' | 'SHOP_FRANCHISEE';
  roleId: number;
  roleName: string;
};

export type ShopListInfo = {
  code: string;
  corpId: number;
  id: number;
  name: string;
  status: string;
  type: string;
  ymStoreId: string;
};

export interface UserInfo {
  userId?: number;
  name?: string;
  phone?: string;
  avatar?: string;
  corpName?: string;
  shopManager?: boolean;
  privilegeVoList?: any[];
  roleList?: roleListType[];
  currentRoleType?: string;
  corpRoleList?: roleListType[]; // 公司角色list
  shopRoleList?: roleListType[]; // 门店角色list
  token?: string;
}

interface PasswordLoginResponse {
  brandBaseInfoList: BrandBaseInfoList[];
  mobile: string;
  nickname: string;
  status: number;
  token: string;
  userId: number;
  username: string;
}

interface BrandBaseInfoList {
  brandId: number;
  brandName: string;
}

@singleton()
export class LoginService {
  constructor(@inject(HTTPClientToken) private _client: HTTPClientRepository) {}

  /**
   * 获取图形验证码
   */
  getCaptcha = async (): Promise<{ url: string; checkCodeKey: string }> => {
    const response: any = await this._client.post('/userlogin/getCheckCode');
    const url = 'data:image/png;base64,' + response.checkCode;
    return { checkCodeKey: response.checkCodeKey, url };
  };

  getDefaultParams = async () => {
    const [uniqueId, deviceName] = await Promise.all([DeviceInfo.getUniqueId(), DeviceInfo.getDeviceName()]);

    return {
      uniqueCode: uniqueId,
      loginDeviceName: deviceName,
      loginOs: Platform.OS === 'android' ? LoginOsEnum.Android : LoginOsEnum.ios, // 登录平台
      loginChannel: LoginChannelEnum.塔塔工作台, // 登录业务系统
    };
  };

  /**
   * 账号密码登录
   * @param data
   * @returns
   */
  loginByAccount = async (data: LoginParams): Promise<PasswordLoginResponse> => {
    let { password } = data;
    // 密码加密一下
    password = crypto.SHA256(password!).toString(crypto.enc.Hex);
    const params = await this.getDefaultParams();
    console.log('params', params);
    return await this._client.post(
      '/userlogin/teminalLogin',
      {
        ...data,
        password,
        ...params,
      },
      {
        headers: {
          'Teminal-Id': params.uniqueCode,
        },
      },
    );
  };

  /**
   * 获取验证码
   * @param data
   * @returns
   */
  getMobileVerificationCode = async (data: { mobile: string }): Promise<any> => {
    return await this._client.get('/userlogin/sendSms', { params: data });
  };

  /**
   * 登录
   * @param data
   * @returns
   */
  loginByPhone = async (data: LoginParams): Promise<string> => {
    const params = await this.getDefaultParams();
    return await this._client.post('/userlogin/loginByMobile', {
      ...data,
      ...params,
    });
  };
}
