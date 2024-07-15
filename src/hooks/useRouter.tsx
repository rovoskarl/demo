import { Router, Tab } from '@/src/navigation';
import { createContext, useContext } from 'react';
import { ApplicationType } from '../interfaces/role';

interface RouterContextProps {
  tabs: Tab[];
  routes: Router[];
  type?: ApplicationType;
}

export const RouterContext = createContext<RouterContextProps>({ tabs: [], routes: [] });

export const useRouter = () => useContext(RouterContext);
