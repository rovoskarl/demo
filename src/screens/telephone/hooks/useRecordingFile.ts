import { useDependency } from '@/src/ioc';
import { useCallback, useEffect, useRef } from 'react';
import { Linking, NativeModules } from 'react-native';
import { CallReportParams, TelephoneService } from '../service';
import { useEmitter } from './useEmitter';
import BackgroundTimer from 'react-native-background-timer';
import { PERMISSIONS, checkMultiple, requestMultiple } from 'react-native-permissions';
import { Toast, ToastToken } from '@/src/interfaces/notifications';

const permissionList = [
  PERMISSIONS.ANDROID.CALL_PHONE,
  PERMISSIONS.ANDROID.READ_PHONE_STATE,
  PERMISSIONS.ANDROID.READ_CALL_LOG,
];

interface CallData {
  callDate: string;
  callNumber: string;
  callDuration: string;
  callType: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

// Call_Type
// INCOMING_TYPE (值为 1): 表示呼入的通话。
// OUTGOING_TYPE (值为 2): 表示呼出的通话。
// MISSED_TYPE (值为 3): 表示未接来电。 - 对方挂断
// VOICEMAIL_TYPE (值为 4): 表示语音信箱相关通话。
// REJECTED_TYPE (值为 5): 表示拒接的通话。 - 自己挂断
// BLOCKED_TYPE (值为 6): 表示被阻止的通话。
// ANSWERED_EXTERNALLY_TYPE (值为 7): 表示外部应用程序回答的通话。

const { TelephoneModule } = NativeModules;

export const useRecordingFile = ({
  message,
  setMessage,
  refetch,
}: {
  message?: string;
  setMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
  refetch: () => Promise<any>;
}) => {
  const startTime = useRef<number>();
  const service = useDependency(TelephoneService);
  const callData = useRef<CallData>();
  const uploadMp3 = service.uploadFile;
  const callReport = service.callReport;
  const mobileCallBack = service.mobileCallBack;
  const eventEmitter = useEmitter();
  const ToastUtil = useDependency<Toast>(ToastToken);

  const checkPermissions = useCallback(async () => {
    const res = await checkMultiple(permissionList);
    return new Promise(async (resolve) => {
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
          // await onCallPhone(phone);
          resolve(true);
        }
      } else if (res['android.permission.CALL_PHONE'] === 'granted') {
        // TelephoneModule.callPhone(phone);
        resolve(true);
      }
    });
  }, [ToastUtil]);

  const callUpload = useCallback(
    async (operationType: string, attachment?: CallReportParams['attachments']) => {
      try {
        if (message) {
          const data = JSON.parse(message).data;
          await callReport({
            id: data.id,
            receiverId: data.receiverId,
            operationType,
            callDuration: Number(callData.current?.callDuration),
            attachments: attachment,
            callTime: callData.current!.callDate,
          });
        } else {
          await mobileCallBack({
            operationType: operationType,
            callDuration: Number(callData.current?.callDuration),
            attachments: attachment!,
            callTime: callData.current!.callDate,
            customerPhone: Number(callData.current?.callNumber),
          });
        }
        const time = await TelephoneModule.readTime();

        if (!time) {
          TelephoneModule.recordTime(new Date().getTime().toString());
        }

        startTime.current = undefined;
        callData.current = undefined;
        setMessage(undefined);
        refetch();
      } catch (error) {
        console.log(`通话上报：${error}`);
        throw new Error(`通话上报：${error}`);
      }
    },
    [mobileCallBack, callReport, message, refetch, setMessage],
  );

  const uploadFile = useCallback(
    async (data: any) => {
      try {
        const formData = new FormData();
        formData.append('file', {
          uri: data.url,
          type: data.type,
          name: data.name,
        });
        const response = await uploadMp3(formData);
        return response;
      } catch (error) {
        console.log(`上传录音文件: ${error}`);
        throw new Error(`上传录音文件: ${error}`);
      }
    },
    [uploadMp3],
  );

  const findFile = useCallback(async () => {
    try {
      if (callData.current) {
        const res = await TelephoneModule.findLatestRecordingFile(
          callData.current?.callNumber,
          callData.current?.callDate,
        );
        if (res.length > 0) {
          const uploadPromises = res.map((file: any) => uploadFile(file));
          const responses = await Promise.all(uploadPromises);
          const files = responses.map((response) => ({
            fileKey: response.key,
            fileName: response.fileName,
            fileType: response.fileType,
          }));
          await callUpload(
            +callData.current.callType === 1 ? 'CALL_BACK_CALL_RECORDING_RETRIEVED' : 'CALL_RECORDING_RETRIEVED',
            files,
          );
        } else {
          await callUpload(+callData.current.callType === 1 ? 'CALL_BACK_CALL_RECORDING_LOST' : 'CALL_RECORDING_LOST');
        }
      }
    } catch (error) {
      console.log(`查询录音文件：${error}`);
      throw new Error(`查询录音文件：${error}`);
    }
  }, [callUpload, uploadFile]);

  useEffect(() => {
    TelephoneModule.startForegroundService();
    const eventListener = eventEmitter.addListener('onPhoneState', (event: CallData) => {
      console.log('onPhoneState state = ', { ...event });
      if ([1, 2].includes(+event.callType) && +event.callDuration) {
        callData.current = event;
        findFile();
      } else if (+event.callDate) {
        console.log('+event.callDate', +event.callDate);
        callData.current = event;
        callUpload([1, 5, 3].includes(+event.callType) ? 'CALL_BACK_BLOCK_CALL' : 'BLOCK_CALL');
      }
    });

    return () => {
      eventListener.remove();
    };
  }, [callUpload, eventEmitter, findFile]);

  const onCallReport = useCallback(
    async (
      { operationType, callDuration, callTime, customerPhone }: any,
      attachment?: CallReportParams['attachments'],
    ) => {
      await mobileCallBack({
        operationType: operationType,
        callDuration: Number(callDuration),
        attachments: attachment!,
        callTime: callTime,
        customerPhone: Number(customerPhone),
      });
    },
    [mobileCallBack],
  );
  useEffect(() => {
    BackgroundTimer.runBackgroundTimer(async () => {
      const isNext = await checkPermissions();
      if (!isNext) {
        return;
      }
      const time = await TelephoneModule.readTime();
      if (time) {
        const res = await TelephoneModule.matchCallRecordsAndRecordings(time);
        console.log(res);
        if (res && res?.length) {
          for (const record of res) {
            if (record?.duration && record?.recording) {
              const responses = await uploadFile({
                url: record.recording,
                type: record?.type,
                name: record?.name,
              });

              const files: any = [
                { fileKey: responses.key, fileName: responses.fileName, fileType: responses.fileType },
              ];

              await onCallReport(
                {
                  operationType:
                    +record.callType === 1 ? 'CALL_BACK_CALL_RECORDING_RETRIEVED' : 'CALL_RECORDING_RETRIEVED',
                  callDuration: record?.duration,
                  callTime: record.date,
                  customerPhone: record.number,
                },
                files,
              );
              TelephoneModule.recordTime(new Date().getTime().toString());
              continue;
            }

            await onCallReport({
              operationType: [1, 5, 3].includes(+record.callType) ? 'CALL_BACK_BLOCK_CALL' : 'BLOCK_CALL',
              callDuration: record?.duration,
              callTime: record.date,
              customerPhone: record.number,
            });
            TelephoneModule.recordTime(new Date().getTime().toString());
          }
        }
      }
    }, 1200000);
  }, [checkPermissions, onCallReport, uploadFile]);
};
