/**
 * 把对象中的某个字段转换为 JSON 字符串
 * @param obj
 * @param pathnames 需要转换的字段路径，支持通过字符串数组的方式选择嵌套路径
 */
export function convertFieldToJSON(obj: any, pathnames: string[]) {
  const newObj = { ...obj };
  pathnames.forEach((pathname) => {
    const keys = pathname.split('.');
    let temp = newObj;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        temp[key] = JSON.stringify(temp[key]);
      } else {
        temp = temp[key];
      }
    });
  });
  return newObj;
}

/**
 * 把枚举转换为Select组件中的options
 * @param enumObj 枚举对象
 * @param enumNames 可选的 枚举值的名称 {xxx: 'xxx'}, 如果不传则使用枚举对象的key作为label
 * @param exclude 可选的 排除的枚举值 ['xxx']，不会出现在options中
 * @returns Select组件中的options [{label: 'xxx', value: 'xxx'}]
 */
export function convertEnumToOptions(enumObj: any, enumNames?: Record<string, any>, exclude: string[] = []) {
  return Object.keys(enumObj)
    .filter((key) => !exclude.includes(enumObj[key]))
    .map((key) => ({ label: enumNames ? enumNames[enumObj[key]] : key, value: enumObj[key] }));
}

/**
 * 把JSON字符串反序列化为JSON对象
 * @param str JSON字符串
 * @returns 反序列化后的JSON对象，如果解析失败则返回undefined
 */
export const parserJSON = <T = any>(str: string): T | undefined => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return undefined;
  }
};

/**
 * 把JSON对象序列化为JSON字符串
 * @param obj  JSON对象
 * @returns JSON字符串，如果序列化失败则返回undefined
 */
export const stringifyJSON = (obj: any): string | undefined => {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    return undefined;
  }
};

/**
 * 将列表转换为映射表
 * @param {string} idKeyName 从列表元素中获取id的键名
 * @param {Array} list 原始数据列表
 * @returns {Map} 映射表
 */
export const convertListToMap = <K extends string | number, T extends Record<string, any>>(
  idKeyName: string,
  list: T[],
): Map<K, T> => {
  return new Map(
    list.reduce((acc, cur) => {
      acc.push([cur[idKeyName], cur]);
      return acc;
    }, [] as [K, T][]),
  );
};

export type TreeNode<T extends { [key: string]: any }> = T & { children?: TreeNode<T>[] };

/**
 * 将列表转换为树结构
 * @param {string} idKeyName 从列表元素中获取id的键名
 * @param {string} parentIdKeyName 从列表元素中获取pid的键名
 * @param {Array} list 原始数据列表
 * @returns {Array} 树结构列表
 */
export function convertListToTree<T extends { [key: string]: any }>(
  idKeyName: keyof T,
  parentIdKeyName: keyof T,
  list: T[],
): TreeNode<T>[] {
  // 创建一个空的树结构列表
  const treeList: T[] = [];

  // 创建一个映射表，用于快速查找元素
  const map: { [key: string]: TreeNode<T> } = {};

  // 遍历原始数据列表，将每个元素添加到映射表中
  list.forEach((item) => {
    // 通过结构赋值clone一份数据
    map[item[idKeyName]] = { ...item };
  });

  // 遍历原始数据列表，将每个元素添加到树结构列表中
  list.forEach((item) => {
    // 获取当前元素的父节点ID
    const parentId = item[parentIdKeyName];

    // 如果当前元素没有父节点，则将其作为根节点添加到树结构列表中
    if (!parentId) {
      treeList.push(map[item[idKeyName]]);
      return;
    }

    // 如果当前元素有父节点，则将其添加到父节点的children属性中
    const parentItem = map[parentId];
    if (parentItem) {
      if (!parentItem.children) {
        parentItem.children = [];
      }
      parentItem.children.push(map[item[idKeyName]]);
    }
  });

  return treeList;
}

/**
 * @method        getOptionValue
 * @param currrentObject
 * @param key
 * @returns
 */
export function getOptionValue<T extends Readonly<Record<string, any>>, K extends keyof T>(currrentObject: T, key: K) {
  return currrentObject[key];
}

/**
 * @method              getUniqueArray
 * @param originList
 * @param key
 * @returns
 */
export function getUniqueArray(originList: Record<string, any>[], key: string) {
  let indexMap = new Map();
  for (let item of originList) {
    if (!indexMap.has(item[key])) {
      indexMap.set(item[key], item);
    }
  }
  return [...indexMap.values()];
}

/**
 * 对象转成 get请求用的字符串
 * @param obj
 * @returns
 */

export function objParamsToString(obj: Object) {
  if (!obj) {
    return '';
  }
  const params = [];
  for (const [key, value] of Object.entries(obj)) {
    params.push(`${key}=${value}`);
  }
  return `?${params.join('&')}`;
}
