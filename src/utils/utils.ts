import { NativeModules } from 'react-native';

export const UtilModule = NativeModules.UtilModule as UtilModule;

type RESULTS = {
  LIMITED: 'LIMITED';
  GRANTED: 'GRANTED';
  BLOCKED: 'BLOCKED';
  DENIED: 'DENIED';
};

type UtilModule = {
  request: (permission: string) => Promise<RESULTS>;
  showDownloadProgressBar: (title: string, progress: number) => void;
  hideDownloadProgressBar: () => void;
  showDownloadCompleteNotification: (title: String, description: String, file: String) => void;
};
