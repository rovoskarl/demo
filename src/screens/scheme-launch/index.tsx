import { Loading } from '@/src/components';
import { useDependency } from '@/src/ioc';
import { GlobalStore } from '@/src/store';
import { useEffect } from 'react';

export function SchemeLaunch() {
  const global = useDependency(GlobalStore);
  useEffect(() => {
    if (!global.applicationType) {
      global.onInit();
    } else {
      global.handleSchemeLaunch();
    }
    console.log('SchemeLaunch', global.applicationType);
  }, [global, global.applicationType]);
  return <Loading />;
}
