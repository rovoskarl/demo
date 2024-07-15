export type TCustomFieldGroupDetail = {
  fieldGroupName: string;
  groupId: number;
  levels: {
    levelId: number;
    levelName: string;
    children: {
      fields: {
        fieldCode: string;
        fieldName: string;
        id: number;
        isSystem: boolean;
        levelId: number;
        options: {
          description: string;
          value: number;
        }[];
        required: boolean;
        showRules: {
          cascadeFieldId: string | number;
          fieldValue: number[];
          oper: string;
        }[];
        type: FieldsTypeEnum;
        description?: string;
      }[];
      levelId: number;
      levelName: string;
    }[];
  }[];
};

export const isVideoUrl = (url: string): boolean => {
  const videoExtensions = ['mp4', 'mov', 'avi', 'flv', 'wmv', 'mkv', 'webm'];
  const urlWithoutQuery = url?.split('?')?.[0];
  const urlExtension = urlWithoutQuery?.split('.').pop()?.toLowerCase();
  return videoExtensions.includes(urlExtension || '');
};

export enum CustomFieldGroupIdEnum {
  'PinMapCollectionInfo' = 22,
  'PinMapInfo' = 246,
  'ShopInfo' = 7,
  'PoiInfo' = 236,
}

export enum FieldsTypeEnum {
  TEXT = 1,
  SINGLE_CHOICE,
  MULTIPLE_CHOICE,
  NUMBER,
  DATE,
  LINK,
  IMAGE,
  FILE,
  LOCATION,
  ADDRESS,
  AREA,
  COLOR,
  ICON,
  GROUP,
}

/**
 * 通过字段分组详情数据获取字段列表
 */
export const getFieldListByFieldGroupDetail = (fieldGroupDetail: TCustomFieldGroupDetail) => {
  const fieldList: { type: FieldsTypeEnum; id: number }[] = [];

  fieldGroupDetail?.levels?.forEach((oneItem) =>
    oneItem.children?.forEach((twoItem) => fieldList.push(...(twoItem.fields || []))),
  );

  return fieldList;
};

/**
 * 处理自定义字段表单值
 */
export const getPositionCustomFields = ({
  customFieldList,
  values,
}: {
  customFieldList: { type: FieldsTypeEnum; id: number }[];
  values: { [name: number]: any };
}) => {
  const positionCustomFields: Record<string, any>[] = [];

  customFieldList?.forEach((item) => {
    if (values[item.id] || typeof values[item.id] === 'number') {
      const field: Record<string, any> = {
        fieldId: item.id,
      };

      if ([1, 4, 5, 6].includes(item.type)) {
        field.fieldValue = values[item.id];
      }

      if ([2].includes(item.type)) {
        field.radioValue = values[item.id];
      }

      if ([3].includes(item.type)) {
        field.checkboxValues = values[item.id];
      }

      if ([7, 8].includes(item.type)) {
        field.fileInfos = values[item.id];
      }

      positionCustomFields.push(field);
    }
  });

  return positionCustomFields;
};

/**
 * 处理自定义字段回显值
 * @param fieldValues 自定义字段值
 */

export const positionCustomFieldsReappearance = (fieldValues: Record<string, any>[]) => {
  const positionCustomFields: { [key: number]: any } = {};

  fieldValues?.forEach((item) => {
    if ([1, 4, 6, 5].includes(item.type)) {
      positionCustomFields[item.fieldId] = item.fieldValue;
    }

    if ([2].includes(item.type)) {
      positionCustomFields[item.fieldId] = item.radioValue;
    }

    if ([3].includes(item.type)) {
      positionCustomFields[item.fieldId] = item.checkboxValues;
    }

    if ([7, 8].includes(item.type)) {
      positionCustomFields[item.fieldId] = item.fileInfos;
    }
  });

  return positionCustomFields;
};

export const positionDetailToFormValue = (data: Record<string, any>) => {
  const {
    color: dataColor,
    icon,
    groupName,
    groupId,
    longitude: lng,
    latitude: lat,
    cityname,
    adname,
    pname,
    province,
    city,
    district,
    fieldValues,
    positionImages,
    imageList,
    images,
    ...restDetail
  } = data || {};
  const positionCustomFields = positionCustomFieldsReappearance(fieldValues || []);
  const formValue = {
    ...restDetail,
    ...positionCustomFields,
    color: dataColor ? [dataColor] : [1],
    icon: icon ? [{ url: icon }] : undefined,
    lnglat: [lng, lat].join(','),
    area: [province || pname, city || cityname, district || adname].join(','),
    group: {
      name: groupName,
      id: groupId,
    },
    positionImages: positionImages ? positionImages.map((item: string) => ({ url: item })) : undefined,
    imageList: imageList ? imageList.map((item: string) => ({ url: item })) : undefined,
    images: images ? images.map((item: string) => ({ url: item })) : undefined,
  };
  return formValue;
};
