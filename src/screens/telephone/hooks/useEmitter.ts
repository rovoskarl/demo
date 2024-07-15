import { NativeEventEmitter, NativeModules } from 'react-native';

export const useEmitter = () => {
  const emitter = new NativeEventEmitter(NativeModules.TelephoneModule);
  return emitter;
};
