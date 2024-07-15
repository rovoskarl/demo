/** 本地存储token */
export const StorageToken = Symbol('StorageToken');

export interface StorageType {
  /**
   * 在Storage中获取key对应的数据，如果返回null，则表示没有该数据
   * @param {string} key
   * @returns {T | null} 反序列化的数据
   */
  getItem<T>(key: string): Promise<T | null>;
  /**
   * 在Storage中获取key对应的数据，如果localStorage中没有该数据，则返回initValue
   * @param {string} key
   * @param {any} initValue
   * @returns {T} 反序列化的数据
   */
  getItem<T>(key: string, initValue: T): Promise<T>;
  /**
   * 在Storage中保存key对应的数据
   * @param {string} key
   * @param {any} value
   * @return {boolean} 是否保存成功
   */
  setItem(key: string, value: any): Promise<boolean>;
  /**
   * 删除key对应的数据
   * @param {string} key
   */
  removeItem(key: string): Promise<void>;
}
