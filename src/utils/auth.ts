import { StorageType, StorageToken } from '@/src/interfaces/storage';
import { inject, singleton } from 'tsyringe';

@singleton()
export class Authorization {
  static _TOKEN_KEY = '__APPLICATION_AUTH_TOKEN__V1.0';
  private static USER_STORE_KEY = '_APPLICATION_USER__V1.0';
  private _token = '';

  constructor(@inject(StorageToken) private _storage: StorageType) {}

  public setToken(token: string) {
    this._token = token;
    return this._storage.setItem(Authorization._TOKEN_KEY, token);
  }

  public async getToken() {
    if (!this._token) {
      return this._storage.getItem<string>(Authorization._TOKEN_KEY);
    }
    return this._token;
  }

  public removeToken() {
    this._token = '';
    this._storage.removeItem(Authorization._TOKEN_KEY);
  }

  public removeUser() {
    this._storage.removeItem(Authorization.USER_STORE_KEY);
  }

  public get isValid() {
    return !!this._token;
  }
}
