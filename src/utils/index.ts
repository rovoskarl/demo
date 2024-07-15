import { container } from 'tsyringe';
import { StorageType, StorageToken } from '@/types/storage';
import { Toast, ToastToken } from '@/types/notifications';
import { ApplicationRester, ApplicationResterToken } from '@/types/application';

import { RNToast } from './toast';
import { Storage } from './storage';
import { Authorization } from './auth';
import { RNApplicationRester } from './application-rester';
import { NavigatorRef, NavigatorToken } from '../navigation';

export * from './auth';
export * from './query-client';
export * from './application-rester';
export * from './utils';
export * from './distance';

container.registerSingleton<StorageType>(StorageToken, Storage);
container.registerSingleton<Authorization>(Authorization, Authorization);
container.registerSingleton<ApplicationRester>(ApplicationResterToken, RNApplicationRester);
container.registerInstance(NavigatorToken, NavigatorRef);
container.registerSingleton<Toast>(ToastToken, RNToast);
