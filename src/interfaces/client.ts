import { AxiosRequestConfig } from 'axios';

export enum HTTPClientIdentification {
  // 营运通
  YY = 'yy',
  // 拓店
  TD = 'td',
  // CRM
  CRM = 'crm',
}

export interface HTTPClientConfig {
  /** 默认中台接口 */
  baseURL: string;
  /** 营运通 */
  yyBaseURL: string;
  /** 拓店 */
  tdBaseURL: string;
  /** CRM */
  crmBaseURL: string;
}

export interface HTTPClientRequestOptions extends AxiosRequestConfig {
  /** 自定义的请求头参数 */
  headers?: Record<string, string>;
  /**  */
  params?: any;
  data?: any;
  /** 是否在接口层就提示异常 */
  handleError?: boolean;
  /** 是否返回原始响应数据 默认false */
  rawRes?: boolean;
}

export interface HTTPClient {
  get<T>(url: string, options?: HTTPClientRequestOptions): Promise<T>;
  post<T>(url: string, data?: any, options?: HTTPClientRequestOptions): Promise<T>;
  put<T>(url: string, data?: any, options?: HTTPClientRequestOptions): Promise<T>;
  delete<T>(url: string, options?: HTTPClientRequestOptions): Promise<T>;
  patch<T>(url: string, data?: any, options?: HTTPClientRequestOptions): Promise<T>;
}

/** http客户端配置参数依赖注入token */
export const HTTPClientConfigToken = Symbol('HTTPClientConfigToken');

/** http客户端注入token */
export const HTTPClientToken = Symbol('HTTPClientToken');

/**
 * 没有登录或者登录已过期的异常
 */
export class UnauthorizedError extends Error {
  constructor(message = '当前用户未登录或登录已过期') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

/**
 * 没有权限的异常
 */
export class ForbiddenError extends Error {
  constructor(message = '没有权限') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

/**
 * 服务器端异常
 */

export class ServerError extends Error {
  /** 本次请求的axios response */
  public readonly response?: any;
  constructor(message = '服务器异常', response?: any) {
    super(message);
    this.response = response;
    this.name = 'ServerError';
  }
}
