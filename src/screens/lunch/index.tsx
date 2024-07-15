import { useEffect } from 'react';
import { useDependency } from '@/src/ioc';
import { GlobalStore } from '@/src/store';
import { StatusBar } from 'react-native';
import { Spinner } from 'tamagui';
import { Container } from '@/src/components';
import { observer } from 'mobx-react-lite';
import { ApplicationType } from '@/src/interfaces/role';
import { container } from 'tsyringe';
import { NavigatorType } from '@/src/hooks';
import { NavigatorToken, ROUTER_FLAG } from '@/src/navigation';

export const LunchScreen = observer(() => {
  const nav = container.resolve<NavigatorType>(NavigatorToken);
  const global = useDependency(GlobalStore);

  useEffect(() => {
    if (global.applicationType === ApplicationType.ZZ || global.applicationType === ApplicationType.YYT) {
      nav.resetRoot({
        index: 0,
        routes: [{ name: ROUTER_FLAG.Main }],
      });
    } else if (!global.applicationType) {
      global.onInit();
    }
  }, [global, nav]);

  return (
    <Container alignItems="center" justifyContent="center">
      <StatusBar animated={true} hidden={false} barStyle="dark-content" backgroundColor="#ffffff" />
      <Spinner size="large" color="$primaryLight" />
    </Container>
  );
});
