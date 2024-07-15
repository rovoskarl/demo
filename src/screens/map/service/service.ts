import { inject, singleton } from 'tsyringe';
import { HTTPClientRepository } from '@/client/service';
import { HTTPClientToken } from '@/types/client';
import { objParamsToString } from '@/src/utils/tools';
import { TCreateUserList, TCreateUserListParams } from '@/src/interfaces/map';

@singleton()
export class StoreSelectService {
  constructor(@inject(HTTPClientToken) private _client: HTTPClientRepository) {}

  /** 查询自定义查询条件字段 */
  getSearchField = async (params: any): Promise<any> => {
    return await this._client.get('td/map/custom/field/listConditionField', { params });
  };
  /** 点位数量统计 */
  getCountWithAdLevel = async (params: any): Promise<any> => {
    return await this._client.post('td/map/position/countByAdLevel', params);
  };

  /** 上传图片 */
  uploadFiles = async (params: any): Promise<any> => {
    return await this._client.post('td/uploadFiles', params, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  /** 上传文件 */
  uploadFile = async (params: any): Promise<any> => {
    return await this._client.post('td/uploadFile', params, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  /** 查询地图列表 */
  getMapList = async (params: any): Promise<any> => {
    return await this._client.post('td/map/list', params);
  };

  /** 新增点位  */
  addLocation = async (params: any): Promise<any> => {
    return await this._client.post('td/map/position/add', params);
  };

  /** 获取分组列表  */
  getGroupList = async (params: any): Promise<any> => {
    return await this._client.post('td/map/group/list', params);
  };

  /** 添加分组  */
  addGroup = async (params: any): Promise<any> => {
    return await this._client.post('td/map/group/add', params);
  };

  /** 上传图标 */
  uploadIcon = async (params: any): Promise<any> => {
    return await this._client.post('td/uploadIcon', params, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  /** 获取图标list */
  getIcons = async (params: any): Promise<any> => {
    return await this._client.get('td/map/position/icon/list', { params });
  };

  /** 添加图标 */
  addIcons = async (params: any): Promise<any> => {
    return await this._client.post('td/map/position/icon/add', params);
  };

  /** 删除图标 */
  delIcons = async (params: any): Promise<any> => {
    return await this._client.delete('td/map/position/icon/del', { data: params });
  };

  /** 查询点位列表（地图）*/
  getPositionList = async (params: any): Promise<any> => {
    return await this._client.post('td/map/position/list', params);
  };
  /**
   * @method          batchImportExpandPointer
   * @description     一键导入点位
   * @param params
   * @returns
   */
  batchImportExpandPointer = async (params: any): Promise<any> => {
    return await this._client.post('td/map/position/app/import', params);
  };
  /** 查询自定义字段分组列表*/
  getGroupFieldList = async (): Promise<any> => {
    return await this._client.get('td/map/custom/field/group/list');
  };

  /** 查询自定义分组字段列表 */
  getGroupFields = async (params: any): Promise<any> => {
    return await this._client.post('td/map/custom/field/group/listField', params);
  };

  /** 点位详情 */
  getPositionDetail = async (id: any): Promise<any> => {
    return await this._client.get(`td/map/position/detail/${id}`);
  };

  /** 删除点位 */
  deletePosition = async (id: any): Promise<any> => {
    return await this._client.get(`td/map/position/delete/${id}`);
  };

  /** 点位操作记录   */
  getPositionRecord = async (params: any): Promise<any> => {
    return await this._client.post('td/map/position/listOperateRecord', params);
  };
  /** 编辑点位  */
  updateDateLocation = async (params: any): Promise<any> => {
    return await this._client.post('td/map/position/update', params);
  };
  /** 点位创建人  */
  getCreateUserList = async (params: TCreateUserListParams): Promise<TCreateUserList[]> => {
    return await this._client.get(`td/map/position/createUser/list${objParamsToString(params)}`);
  };
  // 根据名称查询点位分页列表（搜索框）
  getPositionListWithSearch = async (params: any): Promise<any> => {
    return await this._client.get('td/dingMap/searchName', { params });
  };
  // 批量编辑点位
  batchUpdatePosition = async (params: any): Promise<any> => {
    return await this._client.post('td/map/position/updateBatch', params);
  };
  // 批量删除点位
  batchDeletePosition = async (params: any): Promise<any> => {
    return await this._client.post('td/map/position/deleteBatch', params);
  };
  // 批量移动点位
  batchMovePosition = async (params: any): Promise<any> => {
    return await this._client.post('td/map/position/move', params);
  };
  // 根据分组ID查询列表-包括子级点位
  listByGroupIdWithSubLevel = async (params: any): Promise<any> => {
    return await this._client.get(`td/map/position/listByGroupIdWithSubLevel${objParamsToString(params)}`);
  };
  /** 自定义字段详情 */
  getCustomFieldDetail = async (id: any): Promise<any> => {
    return await this._client.get(`td/map/custom/field/detail?fieldIdList=${id}`);
  };

  /** 门店详情 */
  getShopDetail = async (id: any): Promise<any> => {
    return await this._client.get(`td/shop/${id}`);
  };
  /** poi点位详情 */
  getCoopetitionDetail = async (params: any): Promise<any> => {
    return await this._client.get(`td/coopetitionPosition/detail/${objParamsToString(params)}`);
  };
  /** 获取门店 poi 分组 */
  getShopAndPoiList = async (params: any): Promise<any> => {
    return await this._client.post('td/map/group/shopAndPoiList', params);
  };
  /** 获取门店、poi(竞争/协同/poi) 点位 */
  getShopAndPoiPositionList = async (params: any): Promise<any> => {
    return await this._client.post('td/map/group/shopAndPoiPositionList', params);
  };

  /** 查询行政区划 */
  getProvinceCityArea = async (): Promise<any> => {
    return await this._client.post('td/openapi/district/getProvinceCityArea');
  };

  /** poi 列表 */

  getPoiList = async (): Promise<any> => {
    return await this._client.get('td/coopetition/list');
  };
  /** 点位筛选-包括钉图、门店、POI点位 */
  filterPostition = async (params: any): Promise<any> => {
    return await this._client.post('td/dingMap/filterPostition', params);
  };
  /** 点获取周边3千米以内的所有点位 */
  getNearPositionInfo = async (params: any): Promise<any> => {
    return await this._client.post('td/dingMap/nearPositionInfo', params);
  };
  /** 查询门店点位创建人 */

  getShopCreateUser = async (): Promise<any> => {
    return await this._client.get('td/shop/position/createUser/list');
  };
  /** 普通分组走这个接口获取点位   */
  getListByGroupId = async (params: any): Promise<any> => {
    return await this._client.post('td/map/position/listByGroupId', params);
  };
  /** 点位数量统计   */
  getCountByAdLevel = async (params: any): Promise<any> => {
    return await this._client.post('td/dingMap/countByAdLevel', params);
  };

  /** 根据分组ID查询分组详情 */
  getCustomFieldGroupDetail = async (groupId: any): Promise<any> => {
    return await this._client.get(`td/map/custom/field/group/detail/${groupId}`);
  };
  /**获取OSS上传临时凭证 */
  getOSSToken = async (): Promise<any> => {
    return await this._client.get('td/common/oss/sts');
  };

  /**任务统计 */
  getTaskCount = async (): Promise<any> => {
    return await this._client.get('td/flow/audit/task/count');
  };

  /**待处理列表 */
  getTodoList = async (): Promise<any> => {
    return await this._client.get('td/flow/audit/todo/list');
  };

  /**根据地图id获取关联的行政区信息 */
  getDistrict = async (mapId: any): Promise<any> => {
    return await this._client.get(`td/mapDataAuth/district/get/${mapId}`);
  };

  /** 任务列表 */
  getTaskList = async (params: any): Promise<any> => {
    return await this._client.post('td/map/position/task/list', params);
  };

  /** 生成OSS文件URL */
  getFileUrl = async (params: any): Promise<any> => {
    return await this._client.post('td/common/oss/getFileUrl', params);
  };

  /** 审核不通过 */
  flowAuditReject = async (params: any): Promise<any> => {
    return await this._client.post('td/flow/audit/reject', params);
  };

  /** 审核通过 */
  flowAuditApprove = async (params: any): Promise<any> => {
    return await this._client.post('td/flow/audit/approve', params);
  };

  /** 审核驳回 */
  flowAuditTurn = async (params: any): Promise<any> => {
    return await this._client.post('td/flow/audit/turn', params);
  };

  /** 任务信息采集 */
  collectTaskPosition = async (params: any): Promise<any> => {
    return await this._client.post('td/map/position/task/collect', params);
  };

  /** 根据行政区编码获取关联地图id */
  getMapIdByAdCode = async (code: any): Promise<any> => {
    return await this._client.get(`td/mapDataAuth/map/get/${code}`);
  };
}

export type TOSSToken = {
  accessKeyId: string;
  accessKeySecret: string;
  bucket: string;
  expiration: {
    epochSecond: number;
    nano: 0;
  };
  prefix: string;
  securityToken: string;
};

export type TGetFileUrlParams = {
  bucket: string;
  key: string;
};
