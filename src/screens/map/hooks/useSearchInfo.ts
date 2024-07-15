import { TCreateUserList } from '@/src/interfaces/map';
import { create } from 'zustand';

type SearchInfoState = {
  createUserList: TCreateUserList[];
  createUserShopList: TCreateUserList[];
  searchFields: any[];
  searchShopFields: any[];
  searchPoiFields: any[];
  setSearchFields: (list: any[]) => void;
  setSearchShopFields: (list: any[]) => void;
  setSearchPoiFields: (list: any[]) => void;
  setCreateUserList: (list: TCreateUserList[]) => void;
  setCreateUserShopList: (list: TCreateUserList[]) => void;
};

export const useSearchInfo = create<SearchInfoState>((set) => ({
  createUserList: [],
  createUserShopList: [],
  searchFields: [],
  searchShopFields: [],
  searchPoiFields: [],
  setCreateUserList: (list: any) => set({ createUserList: list }),
  setCreateUserShopList: (list: any) => set({ createUserShopList: list }),
  setSearchFields: (list: any) => set({ searchFields: list }),
  setSearchShopFields: (list: any) => set({ searchShopFields: list }),
  setSearchPoiFields: (list: any) => set({ searchShopFields: list }),
}));
