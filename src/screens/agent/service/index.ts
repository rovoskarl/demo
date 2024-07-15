import { inject, singleton } from 'tsyringe';
import { HTTPClientRepository } from '@/client/service';
import { HTTPClientToken } from '@/types/client';
import { objParamsToString } from '@/src/utils/tools';

@singleton()
export class Service {
  constructor(@inject(HTTPClientToken) private _client: HTTPClientRepository) {}

  /**任务统计 */
  getTaskCount = async (): Promise<any> => {
    return await this._client.get('td/flow/audit/task/count');
  };

  /**待处理列表 */
  getTodoList = async (): Promise<any> => {
    return await this._client.get('td/flow/audit/todo/list');
  };

  /**已处理列表 */
  getDoneList = async (params: any): Promise<any> => {
    return await this._client.get(`td/flow/audit/done/page/${objParamsToString(params)}`);
  };

  /**我的申请列表 */
  getMyApplyList = async (params: any): Promise<any> => {
    return await this._client.get(`td/flow/audit/my/apply/page/${objParamsToString(params)}`);
  };

  /**任务分页 */
  getTasks = async (params: any): Promise<any> => {
    return await this._client.post('td/map/position/task/page', params);
  };
  /**扩店平台人员分页列表 */
  getPlatformUsers = async (params: any): Promise<any> => {
    return await this._client.post('td/map/position/task/ownerUser/page', params);
  };
  /**采集任务数 */
  getTaskCollectionCount = async (): Promise<any> => {
    return await this._client.post('td/map/position/task/user/count', { status: 4 });
  };
}
