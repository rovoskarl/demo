import { useDependency } from '@/src/ioc';
import { UserStore } from '@/src/store';

export const useUser = () => {
  const { currentUser } = useDependency(UserStore);

  return { user: currentUser?.shUser };
};
