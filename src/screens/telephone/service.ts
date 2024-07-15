import { HTTPClientRepository } from '@/src/client/service';
import { HTTPClientToken } from '@/src/interfaces/client';
import { inject, singleton } from 'tsyringe';

interface Params {
  pageNum: number;
  pageSize: number;
}

export interface CallResult {
  pages: number;
  result: Call[];
  total: number;
}

export interface Call {
  callPhone: string;
  operationType: string;
  callTime: string;
  callerId: number;
  callerName: string;
  id: number;
  receiverId: number;
  receiverName: string;
  callDuration: number;
}

export interface CallReportParams {
  url?: string;
  callDuration?: number;
  id: number;
  callTime: string;
  operationType: string;
  receiverId: number;
  attachments?: {
    fileKey: string;
    fileName: string;
    fileType: string;
  }[];
}

export interface CallBackReportParams {
  callDuration: number;
  callTime: string;
  customerPhone: number;
  operationType: string;
  attachments: {
    fileKey: string;
    fileName: string;
    fileType: string;
  }[];
}

interface FileRes {
  fileName: string;
  fileType: string;
  key: string;
  url: string;
}

@singleton()
export class TelephoneService {
  constructor(@inject(HTTPClientToken) private _client: HTTPClientRepository) {}

  /**
   * 获取通话列表
   */
  fetchCallList = async (params: Params): Promise<CallResult> => {
    const result: { data: { data: CallResult } } = await this._client.get('crm/callLong/selectByPage', {
      params,
      rawRes: true,
    });
    return result.data.data;
  };

  /** 上传文件 */
  uploadFile = async (params: any): Promise<FileRes> => {
    const response: { data: { data: FileRes } } = await this._client.post('crm/upload', params, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      rawRes: true,
    });

    return response.data.data;
  };

  /**
   * 通话上报
   */
  callReport = async (data: CallReportParams) => {
    return await this._client.post('crm/customer/callReport', data);
  };

  /**
   * 回访上报
   */
  mobileCallBack = async (data: CallBackReportParams) => await this._client.post('crm/customer/mobileCallReport', data);
}
