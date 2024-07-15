import { RouterParams } from './routers';
import { createNavigationContainerRef } from '@react-navigation/native';

export const NavigatorToken = Symbol('NavigationContainerToken');

export const NavigatorRef = createNavigationContainerRef<RouterParams>();
