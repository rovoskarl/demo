import { makeAutoObservable } from 'mobx';
import { singleton } from 'tsyringe';

@singleton()
export class ConfigStore {
  /** 默认主题 */
  isDarkMode: boolean = false;

  /** 语言包 */
  languageMode: string | null = null;

  /** Store Key */
  private static _LANGUAGE_KEY = '_APPLICATION_LANGUAGE__V1.0';

  constructor() {
    makeAutoObservable(this);
  }

  /** 获取深色 */
  get isDark() {
    return this.isDarkMode;
  }

  /** 获取语言包 */
  get language() {
    return this.languageMode;
  }
}
