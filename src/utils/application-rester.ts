import { ApplicationRester } from '@/types/application';
import { NavigatorToken, ROUTER_FLAG, RouterParams } from '@/src/navigation';
import { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import { inject, singleton } from 'tsyringe';
import { config } from './query-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { queryClient } = config();

@singleton()
export class RNApplicationRester implements ApplicationRester {
  constructor(@inject(NavigatorToken) private _nav: NavigationContainerRefWithCurrent<RouterParams>) {}

  public reset = (): void => {
    queryClient.invalidateQueries();
    AsyncStorage.clear();
    this._nav.resetRoot({
      index: 0,
      routes: [{ name: ROUTER_FLAG.Login }],
    });
  };
}
