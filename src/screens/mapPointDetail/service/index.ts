import { inject, singleton } from 'tsyringe';
import { HTTPClientRepository } from '@/client/service';
import { HTTPClientToken } from '@/types/client';
import { objParamsToString } from '@/src/utils/tools';

@singleton()
export class Service {
  constructor(@inject(HTTPClientToken) private _client: HTTPClientRepository) {}

  /** 业务配置信息 */
  getBusinessConfigDetail = async (params: { configId: number }) => {
    return await this._client.get(`td/businessConfig/detail/${objParamsToString(params)}`);
  };

  /** 门店操作记录分页列表 */
  getShopOperation = async ({
    pageNum,
    pageSize,
    shopId,
  }: {
    pageNum: number;
    pageSize: number;
    shopId: number;
  }): Promise<any> => {
    return await this._client.post(`td/shopOperatiron/page?pageNum=${pageNum}&pageSize=${pageSize}&shopId=${shopId}`);
  };

  /** 审核历史记录 */
  getAuditHistory = async (params: { processInstanceId: number }) => {
    return await this._client.get(`td/flow/audit/history/${objParamsToString(params)}`);
  };

  /** 点位操作记录   */
  getPositionRecord = async (params: {
    mapId: number;
    pageSize: number;
    pageNum: number;
    positionId: number;
  }): Promise<any> => {
    return await this._client.post('td/map/position/listOperateRecord', params);
  };
}
