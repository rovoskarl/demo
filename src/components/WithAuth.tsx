import React, { useMemo } from 'react';
import { ApplicationType, CustomAppRole } from '@/src/interfaces/role';
import { GlobalStore, Role, UserStore } from '@/src/store';
import { useDependency } from '@/src/ioc';
import { observer } from 'mobx-react-lite';

export function WithAuth<T extends { permissions: CustomAppRole[]; type: ApplicationType; identity: Role }>(
  WrappedComponent: React.ComponentType<T>,
) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  function WarpComponent(props: Omit<T, 'permissions' | 'type' | 'identity'> & { url?: string; hasData?: boolean }) {
    const user = useDependency(UserStore);
    const global = useDependency(GlobalStore);

    const { applicationRole, applicationType } = global;

    const currentRolePermissions = useMemo(() => {
      return applicationRole?.filter((item) => item.roleType === user.currentRole);
    }, [user.currentRole, applicationRole]);

    const currentPermissions = useMemo(() => {
      if (props.url) {
        return (currentRolePermissions ?? [])
          .filter((item) => item.parentUrl === props?.url)
          .map((item) => (props.hasData ? item : Boolean(item)));
      }
      return currentRolePermissions;
    }, [currentRolePermissions, props.hasData, props.url]);

    return (
      <WrappedComponent
        {...(props as T)}
        permissions={currentPermissions}
        type={applicationType}
        identity={user.currentRole}
      />
    );
  }

  WarpComponent.displayName = `WithAuth(${displayName})`;

  return observer(WarpComponent);
}
