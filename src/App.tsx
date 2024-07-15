import { config } from '@/src/utils';
import { PortalProvider, TamaguiProvider } from 'tamagui';
import { container } from 'tsyringe';
import { IOCProvider } from './ioc';

import { RootNavigator } from './screens';
import themeConfig from '../tamagui.config';
import { ErrorHandler, ThemeProvide } from './components';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Orientation from 'react-native-orientation-locker';

import '@/src/ioc/dependencies';
import { useEffect } from 'react';
import { AMapSdk } from '@tastien/react-native-amap3d';
import { Platform } from 'react-native';
import Config from 'react-native-config';
import * as Sentry from '@sentry/react-native';
import { useAppUpdate } from './hooks';

Orientation.lockToPortrait();

const { queryClient, QueryClientProvider } = config();

if (Config.ENV === 'production') {
  Sentry.init({
    dsn: Config.APP_SENTRY_URL,
    environment: Config.ENV,
    release: Config.APP_VERSION,
  });
}

function App() {
  const { updateNode } = useAppUpdate({ isAutoUpdate: true });

  useEffect(() => {
    AMapSdk.init(
      Platform.select({
        android: Config.APP_TD_AMAP_ANDROID_KEY,
        ios: Config.APP_TD_AMAP_IOS_KEY,
      }),
    );
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorHandler>
        <QueryClientProvider client={queryClient}>
          <IOCProvider value={container}>
            <ThemeProvide>
              <TamaguiProvider config={themeConfig} defaultTheme="light">
                <PortalProvider>
                  <RootNavigator />
                  {updateNode}
                </PortalProvider>
              </TamaguiProvider>
            </ThemeProvide>
          </IOCProvider>
        </QueryClientProvider>
      </ErrorHandler>
    </GestureHandlerRootView>
  );
}

export default App;
