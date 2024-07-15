export type TFieldValues = {
  type: number;
  fieldId: number;
  checkboxValues?: number[];
  fieldValue?: string;
  fileInfos?: {
    name: string;
    url: string;
  }[];
  radioValue?: number;
};

export enum CollectedTaskStatusEnum {
  NOT_STARTED = 0,
  NOT_COLLECTED = 1,
  COLLECTED = 2,
  OVERDUE = 3,
}

export const collectedTaskStatusNames = {
  [CollectedTaskStatusEnum.NOT_STARTED]: '未开始',
  [CollectedTaskStatusEnum.NOT_COLLECTED]: '未采集',
  [CollectedTaskStatusEnum.COLLECTED]: '已采集',
  [CollectedTaskStatusEnum.OVERDUE]: '已逾期',
};

export const pinMapStatusNames = {
  1: '待评估',
  2: '已采集',
  3: '入库',
  4: '待定',
  5: '无效',
  6: '已释放',
  7: '已分配',
  8: '已签店',
};

export type TCollectedTaskDetail = {
  address: string;
  beginDate: string;
  city: string;
  cityCode: string;
  createTime: string;
  createUserName: string;
  createUserId: number;
  description: string;
  district: string;
  districtCode: string;
  endDate: string;
  extraFields: TFieldValues[];
  fieldGroupId: number;
  mapPositionId?: number;
  id: number;
  latitude: number;
  longitude: number;
  ownerUserName: string;
  ownerUserId: number;
  province: string;
  provinceCode: string;
  records: {
    createTime: string;
    operationContent: string;
  }[];
  signed: false;
  status: string;
  statusCode: CollectedTaskStatusEnum;
  taskName: string;
};
