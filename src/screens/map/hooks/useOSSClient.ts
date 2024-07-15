import * as AliyunOSS from '@tastien/react-native-oss-sdk';
import { nanoid } from 'nanoid';
import { useService } from './useService';
import { useOSSToken } from './useOSSToken';

export const useOSSClient = () => {
  const { getOSSFileUrl } = useService();
  const { token: ossToken } = useOSSToken();

  const uploadFile = async (file: String) => {
    const suffix = file.substring(file.lastIndexOf('.'));
    const token = ossToken;
    if (token) {
      const uid = nanoid();
      const name = `${token?.prefix}${uid}${suffix}`;
      return AliyunOSS.asyncUploadFile(token!.bucket, name, file);
    }
    throw new Error('Token is not set');
  };

  const getFileUrl = async (key: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      getOSSFileUrl({
        bucket: ossToken!.bucket,
        key: key,
      })
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  };

  return { uploadFile, getFileUrl };
};
