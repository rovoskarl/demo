import moment from 'moment';
import { URL } from 'react-native-url-polyfill';
import { useEffect } from 'react';
import CookieManager from '@react-native-cookies/cookies';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Authorization } from '@/src/utils';
import * as Sentry from '@sentry/react-native';

export function useCookies(url: string) {
  const urlJson = new URL(url);
  const date = moment().add(7, 'day');

  useEffect(() => {
    async function init() {
      try {
        const token = await AsyncStorage.getItem(Authorization._TOKEN_KEY);
        if (token) {
          const webViewCookies = {
            TST_SPEED_H5_TOKEN_V1: JSON.parse(token),
          };
          CookieManager.set(url, {
            name: 'RNWebview',
            value: JSON.stringify(webViewCookies),
            domain: urlJson.host,
            path: urlJson.pathname,
            version: '1',
            expires: date.toString(),
          }).then((done) => {
            console.log('CookieManager.set.v1 =>', done);
          });
        }
      } catch (error) {
        Sentry.captureException(error);
        console.error('useCookies error', error);
      }
    }

    init();
  }, [date, url, urlJson.host, urlJson.pathname]);
}
