export interface TCreateUserListParams {
  mapId: number;
  isPageable: boolean;
  createUserName?: string;
  pageNum?: number;
  pageSize?: number;
}

export interface TCreateUserList {
  createUserId: number;
  createUserName: string;
}

export type SearchType = 'position' | 'shop' | 'poi' | 'group' | 'shopArea' | 'poiArea' | null;
