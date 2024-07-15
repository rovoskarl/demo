import { SearchType } from '@/src/interfaces/map';
import { create } from 'zustand';

type Props = {
  detail: Record<string, any>;
  setDetail: (key: Record<string, any>) => void;
  searchType: SearchType;
  setSearchType: (searchType: SearchType) => void;
};

export const useSearch = create<Props>((set) => ({
  detail: {
    position: {
      colors: [],
      groupInfo: [],
      creators: [],
      conditions: {},
      positionStatusList: [],
    },
    shopPositionRequest: {
      creators: [],
      colors: [],
      conditions: {},
      area: [],
    },
    poiPositionRequest: {
      area: [],
      poiIdList: [],
    },
  },
  setDetail: (detail: Record<string, any>) => {
    set({ detail });
  },

  searchType: null,
  setSearchType: (searchType: SearchType) => {
    set({ searchType });
  },
}));
