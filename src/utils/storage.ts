import { StorageType } from '@/src/interfaces/storage';
import { parserJSON, stringifyJSON } from './tools';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { singleton } from 'tsyringe';

@singleton()
export class Storage implements StorageType {
  async getItem<T>(key: string, initValue?: any): Promise<Promise<T | null> | Promise<T>> {
    const str = await AsyncStorage.getItem(key);
    if (str === null) {
      return initValue;
    }
    return parserJSON(str) || null;
  }
  async setItem(key: string, value: any): Promise<boolean> {
    const str = stringifyJSON(value);
    if (str) {
      await AsyncStorage.setItem(key, str);
      return true;
    }
    return false;
  }
  removeItem(key: string): Promise<void> {
    return AsyncStorage.removeItem(key);
  }
}
