import { useUser } from '@/src/hooks';
import { Toast, ToastToken } from '@/src/interfaces/notifications';
import { useDependency } from '@/src/ioc';
import { Authorization } from '@/src/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Linking, NativeModules } from 'react-native';
import Config from 'react-native-config';
import { PERMISSIONS, checkMultiple, requestMultiple } from 'react-native-permissions';
import { URL } from 'react-native-url-polyfill';
import { useRecordingFile } from './useRecordingFile';
import { useEmitter } from './useEmitter';

const { TelephoneModule } = NativeModules;

const permissionList = [
  PERMISSIONS.ANDROID.CALL_PHONE,
  PERMISSIONS.ANDROID.READ_PHONE_STATE,
  PERMISSIONS.ANDROID.READ_CALL_LOG,
];

export function useSocket(refetch: () => Promise<any>) {
  const user = useUser();

  const [show, setShow] = useState(false);

  const ToastUtil = useDependency<Toast>(ToastToken);

  const url = new URL(Config.API_CRM_BASE_URL);

  const ws = useRef<WebSocket | null>(null);

  const [isConnected, setIsConnected] = useState(false);

  const [message, setMessage] = useState<string>();

  useRecordingFile({ message, setMessage, refetch });

  const eventEmitter = useEmitter();

  const [unsentMessages, setUnsentMessages] = useState<string[]>([]);

  const onCallPhone = useCallback(
    async (phone: string) => {
      try {
        const res = await checkMultiple(permissionList);
        if (
          res['android.permission.CALL_PHONE'] === 'blocked' ||
          res['android.permission.READ_PHONE_STATE'] === 'blocked' ||
          res['android.permission.READ_CALL_LOG'] === 'blocked'
        ) {
          ToastUtil.show('您已拒绝该权限，需要手动开启');
          Linking.openSettings();
        } else if (
          res['android.permission.CALL_PHONE'] === 'denied' ||
          res['android.permission.READ_PHONE_STATE'] === 'denied' ||
          res['android.permission.READ_CALL_LOG'] === 'denied'
        ) {
          const status = await requestMultiple(permissionList);
          if (
            status['android.permission.CALL_PHONE'] === 'blocked' ||
            status['android.permission.READ_PHONE_STATE'] === 'blocked' ||
            status['android.permission.READ_CALL_LOG'] === 'blocked'
          ) {
            ToastUtil.show('您已拒绝该权限，需要手动开启');
            Linking.openSettings();
          } else {
            await onCallPhone(phone);
          }
        } else if (res['android.permission.CALL_PHONE'] === 'granted') {
          TelephoneModule.callPhone(phone);
        }
      } catch (error) {
        console.log('err', error);
      }
    },
    [ToastUtil],
  );

  /** 获取权限 */
  const fetchPermission = useCallback(async () => {
    try {
      const val = await TelephoneModule.requestPermission();
      console.log('fetchPermission', val);
      setShow(!val);
    } catch (error) {
      console.log('获取权限异常', error);
      throw new Error(`获取权限异常 ${error}`);
    }
  }, []);

  useEffect(() => {
    fetchPermission();
  }, [fetchPermission]);

  useEffect(() => {
    if (message) {
      const wssData = JSON.parse(message).data;
      if (wssData.callPhone) {
        onCallPhone(wssData.callPhone);
      }
    }
  }, [message, onCallPhone]);

  const webSocketInit = useCallback(async () => {
    const tokenString = await AsyncStorage.getItem(Authorization._TOKEN_KEY);
    if (!ws.current && tokenString) {
      console.log(`wss://${url.host}/api/websocket/${user.user?.shUserId}`);
      ws.current = new WebSocket(`wss://${url.host}/api/websocket/${user.user?.shUserId}`, null, {
        headers: {
          'user-token': JSON.parse(tokenString),
        },
      });
      ws.current.onopen = () => {
        console.log('打开');
        setIsConnected(true);
      };
      ws.current.onclose = (_e) => {
        console.log('关闭');
        setIsConnected(false);
      };
      ws.current.onerror = (e) => {
        console.log('error', e);
      };
      ws.current.onmessage = (e) => {
        setMessage(e.data);
      };
    }
  }, [url.host, user.user?.shUserId]);

  /**
   * 初始化 WebSocket
   * 且使用 WebSocket 原声方法获取信息
   *  */
  useLayoutEffect(() => {
    webSocketInit();

    return () => {
      ws.current?.close();
    };
  }, [ws, webSocketInit]);

  useEffect(() => {
    if (!isConnected && ws.current) {
      ws.current.close(); // 关闭现有连接

      ws.current = null;

      setTimeout(() => {
        webSocketInit(); // 重新初始化WebSocket
      }, 1000); // 例如，等待1秒再重新连接
    }
  }, [isConnected, ws, webSocketInit]);

  const sendMessage = useCallback(
    (_message: string) => {
      try {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify(_message));
        } else {
          setUnsentMessages((prevMessages) => [...prevMessages, _message]);
        }
      } catch (error) {
        console.error('发送消息失败，尝试重新连接', error);
        webSocketInit();
      }
    },
    [webSocketInit],
  );

  useEffect(() => {
    if (isConnected && unsentMessages.length > 0) {
      unsentMessages.forEach((_message) => {
        sendMessage(_message);
      });
      setUnsentMessages([]);
    }
  }, [isConnected, unsentMessages, sendMessage]);

  useEffect(() => {
    const eventListenerCall = eventEmitter.addListener('outgoingCalls', (event) => {
      sendMessage(event);
    });

    return () => {
      eventListenerCall.remove();
    };
  }, [eventEmitter, message, sendMessage]);

  return {
    message,
    show,
    setShow,
    onCallPhone,
  };
}
