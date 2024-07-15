import { createContext, useContext } from 'react';
import { DependencyContainer, InjectionToken, container } from 'tsyringe';

const IOCContext = createContext<DependencyContainer>(container);

export const useDependency = <T,>(token: InjectionToken<T>) => useContext(IOCContext).resolve(token);

export const IOCProvider = IOCContext.Provider;
