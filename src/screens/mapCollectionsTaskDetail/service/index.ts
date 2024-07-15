import { inject, singleton } from 'tsyringe';
import { HTTPClientRepository } from '@/client/service';
import { HTTPClientToken } from '@/types/client';

@singleton()
export class Service {
  constructor(@inject(HTTPClientToken) private _client: HTTPClientRepository) {}

  /** 获取任务详情 */
  getCollectionsTaskDetail = async (params: { taskId: number }) => {
    return await this._client.get(`td/map/position/task/get/${params.taskId}`);
  };

  /** 扩店平台人员分页列表 */
  getPlatformUserList = async (params: { pageNum: number; pageSize: number; nickname?: string }): Promise<any> => {
    return await this._client.post('td/user/platform/page', params);
  };

  /** 任务派发 */
  dispatchCollectionsTask = async (params: { taskId: number; userId: number; userName: string }) => {
    return await this._client.post('td/map/position/task/dispatch', params);
  };

  /** 任务签到 */
  signInCollectionsTask = async (params: { taskId: number }) => {
    return await this._client.post('td/map/position/task/sign', params);
  };
}
