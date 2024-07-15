import { Authorization } from '@/src/utils';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import {
  ForbiddenError,
  HTTPClient,
  HTTPClientConfig,
  HTTPClientConfigToken,
  HTTPClientIdentification,
  HTTPClientRequestOptions,
  ServerError,
  UnauthorizedError,
} from '@/src/interfaces/client';
import { ApplicationRester, ApplicationResterToken } from '@/types/application';
import { Toast, ToastToken } from '@/types/notifications';
import { inject, singleton } from 'tsyringe';
import { StorageToken } from '../interfaces/storage';
import { Storage } from '@/utils/storage';
import { UserStore } from '../store';
import * as Sentry from '@sentry/react-native';

export const AxiosToken = Symbol('AxiosToken');

/**
 * 在RN平台的HTTP请求客户端实现
 */
@singleton()
export class HTTPClientRepository implements HTTPClient {
  // 携带token的请求头名称
  private static AUTH_TOKEN_HEADER_NAME = 'user-token';
  private static AUTH_BRAND_ID_HEADER_NAME = 'brand-id';
  private static AUTH_YY_ROLE_HEADER_NAME = 'Role-Type';
  private static AUTH_YY_FORM_HEADER_NAME = 'Request-From';
  private _axios: AxiosInstance;
  constructor(
    private _auth: Authorization,
    @inject(ApplicationResterToken) private _rester: ApplicationRester,
    @inject(HTTPClientConfigToken) _config: HTTPClientConfig,
    @inject(ToastToken) private _toast: Toast,
    @inject(StorageToken) private _store: Storage,
  ) {
    const http = axios.create({ baseURL: _config.baseURL, timeout: 10000 });

    http.interceptors.request.use(async (req) => {
      const url = req.url;
      if (url!.startsWith(HTTPClientIdentification.YY)) {
        req.baseURL = _config.yyBaseURL;
        req.url = url!.replace(HTTPClientIdentification.YY, '');
        const currentIdentity = await this._store.getItem(UserStore._IDENTIFY_KEY);
        req.headers[HTTPClientRepository.AUTH_YY_ROLE_HEADER_NAME] = currentIdentity ?? 'CORP';
        req.headers[HTTPClientRepository.AUTH_YY_FORM_HEADER_NAME] = 'APPLICATION';
      } else if (url!.startsWith(HTTPClientIdentification.TD)) {
        req.baseURL = _config.tdBaseURL;
        req.url = url!.replace(HTTPClientIdentification.TD, '');
      } else if (url!.startsWith(HTTPClientIdentification.CRM)) {
        req.baseURL = _config.crmBaseURL;
        req.url = url!.replace(HTTPClientIdentification.CRM, '');
      }
      const token = await this._auth.getToken();
      const brand: any = await this._store.getItem(UserStore._BRAND_KEY);
      if (token) {
        // 实例化的时候通过拦截器添加配置请求头的逻辑
        req.headers[HTTPClientRepository.AUTH_TOKEN_HEADER_NAME] = token;
        req.headers[HTTPClientRepository.AUTH_BRAND_ID_HEADER_NAME] = brand?.brandId ?? '';
      }
      return req;
    });

    http.interceptors.response.use(
      (res) => {
        // TODO 根据后端接口格式处理异常
        if (res.config.responseType === 'blob' || res.config.responseType === 'arraybuffer') {
          return res;
        } else if (res.data?.code !== 200) {
          const message = res.data?.msg || res.data?.message || '未知异常';
          console.log(message);
          return Promise.reject(new ServerError(message, res));
        }
        return res;
      },
      (err) => {
        let error = err;
        // 处理一下特定的服务端异常
        if (err instanceof AxiosError) {
          const codes = [err.status, err.response?.data?.code];
          const isUnauthorized = codes.includes(401);
          if (isUnauthorized) {
            // 这里添加一个接口返回鉴权失效情况下的，全局状态的清理逻辑
            this._rester.reset();
            error = new UnauthorizedError();
          }
          const isForbidden = codes.includes(403);
          if (isForbidden) {
            error = new ForbiddenError();
          }
        }

        return Promise.reject(error);
      },
    );

    this._axios = http;
  }

  private _showMessage = (options: HTTPClientRequestOptions = { handleError: true }) => {
    const { handleError = true } = options;
    return (error: Error) => {
      /** Sentry 上报接口错误信息 */
      Sentry.captureException(error);

      if (!handleError) {
        return Promise.reject(error);
      }
      const message = error.message;

      this._toast.show(message);

      return Promise.reject(error);
    };
  };

  /** 获取有效的相依数据 */
  private _getResPayload(options: HTTPClientRequestOptions = { rawRes: false }): any {
    const { rawRes = false } = options;
    return (res: AxiosResponse) => (rawRes ? res : res.data.result);
  }

  get<T>(url: string, options?: HTTPClientRequestOptions | undefined): Promise<T> {
    return this._axios.get<T, T>(url, options).then(this._getResPayload(options)).catch(this._showMessage(options));
  }

  post<T>(url: string, data?: any, options?: HTTPClientRequestOptions | undefined): Promise<T> {
    return this._axios
      .post<T, T>(url, data ?? {}, options)
      .then(this._getResPayload(options))
      .catch(this._showMessage(options));
  }

  put<T>(url: string, data?: any, options?: HTTPClientRequestOptions | undefined): Promise<T> {
    return this._axios
      .put<T, T>(url, data, options)
      .then(this._getResPayload(options))
      .catch(this._showMessage(options));
  }

  delete<T>(url: string, options?: HTTPClientRequestOptions | undefined): Promise<T> {
    return this._axios.delete<T, T>(url, options).then(this._getResPayload(options)).catch(this._showMessage(options));
  }

  patch<T>(url: string, data?: any, options?: HTTPClientRequestOptions | undefined): Promise<T> {
    return this._axios
      .patch<T, T>(url, data, options)
      .then(this._getResPayload(options))
      .catch(this._showMessage(options));
  }
}
