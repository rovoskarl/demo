import { useDependency } from '../ioc';
import { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import { NavigatorToken, RouterParams } from '../navigation';

export type NavigatorType = NavigationContainerRefWithCurrent<RouterParams>;

export const useNavigator = () => useDependency<NavigatorType>(NavigatorToken);

export * from './useRouter';
export * from './useUser';
export * from './useCookies';
export * from './useAppUpdate';
export * from './useLoader';
