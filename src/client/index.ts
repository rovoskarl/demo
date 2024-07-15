import { container } from 'tsyringe';
import Config from 'react-native-config';
import { HTTPClientRepository } from './service';
import { HTTPClientConfig, HTTPClientConfigToken, HTTPClientToken } from '@/types/client';

container.registerInstance<HTTPClientConfig>(HTTPClientConfigToken, {
  baseURL: Config.API_BASE_URL,
  yyBaseURL: Config.API_YY_BASE_URL,
  tdBaseURL: Config.API_TD_BASE_URL,
  crmBaseURL: Config.API_CRM_BASE_URL,
});

container.registerSingleton(HTTPClientToken, HTTPClientRepository);
