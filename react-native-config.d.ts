declare module 'react-native-config' {
  export interface NativeConfig {
    ENV: string;
    APP_NAME: string;
    APP_VERSION: string;
    APP_IOS_VERSION: string;
    APP_ANDROID_VERSION: string;
    APP_IOS_VERSION_CODE: string;
    APP_ANDROID_VERSION_CODE: string;
    API_BASE_URL: string;
    APP_SENTRY_URL: string;
    API_YY_BASE_URL: string;
    API_TD_BASE_URL: string;
    APP_TD_AMAP_IOS_KEY: string;
    APP_TD_AMAP_ANDROID_KEY: string;
    APP_ZZ_WEBVIEW_URL: string;
    APP_YY_WEBVIEW_URL: string;
    API_CRM_BASE_URL: string;
  }
  export const Config: NativeConfig;
  export default Config;
}

declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
