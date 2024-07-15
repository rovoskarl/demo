import { create } from 'zustand';

type MapInfoState = {
  statusList: number[];
  updateStatus: (info: MapInfoState['statusList']) => Promise<void>;
  ownerUserIdList: string[];
  updateOwnerUserIdList: (info: MapInfoState['ownerUserIdList']) => Promise<void>;
  districtCodes: string[];
  updateDistrictCodes: (info: MapInfoState['districtCodes']) => Promise<void>;
  cityCodes: string[];
  updateCityCodes: (info: MapInfoState['cityCodes']) => Promise<void>;
  provinceCodes: string[];
  updateProvinceCodes: (info: MapInfoState['provinceCodes']) => Promise<void>;
  isNationwide: boolean;
  updateIsNationwide: (info: MapInfoState['isNationwide']) => Promise<void>;
  isCityAll: boolean;
  updateIsCityAll: (info: MapInfoState['isCityAll']) => Promise<void>;
  date: { [key: string]: { from: string; to: string } };
  updateDate: (info: MapInfoState['date']) => Promise<void>;
  searchData: {};
  updateSearchData: (info: MapInfoState['searchData']) => Promise<void>;
  checkedState: { [key: string]: { week: boolean; month: boolean; custom: boolean } };
  setCheckedState: (info: MapInfoState['checkedState']) => Promise<void>;
  clear: () => Promise<void>;
  clear1: () => Promise<void>;
  clear2: () => Promise<void>;
  clear3: () => Promise<void>;
  clear4: () => Promise<void>;
};

export const useSearch = create<MapInfoState>((set, get) => {
  return {
    statusList: [1, 3],
    updateStatus: async (info) => {
      set({ statusList: info });
    },

    ownerUserIdList: [],
    updateOwnerUserIdList: async (info) => {
      set({ ownerUserIdList: info });
    },

    districtCodes: [],
    updateDistrictCodes: async (info) => {
      set({ districtCodes: info });
    },
    cityCodes: [],
    updateCityCodes: async (info) => {
      set({ cityCodes: info });
    },

    provinceCodes: [],
    updateProvinceCodes: async (info) => {
      set({ provinceCodes: info });
    },
    isNationwide: false,
    isCityAll: false,
    updateIsCityAll: async (info) => {
      set({ isCityAll: info });
    },
    updateIsNationwide: async (info) => {
      set({ isNationwide: info });
    },

    date: {
      beginDateRange: {
        from: '',
        to: '',
      },
      endDateRange: {
        from: '',
        to: '',
      },
      createTimeRange: { from: '', to: '' },
      completeTimeRange: { from: '', to: '' },
    },
    updateDate: async (info) => {
      set({ date: info });
    },

    searchData: {},
    updateSearchData: async (info) => {
      set({ searchData: info });
    },
    checkedState: {
      beginDateRange: { week: false, month: false, custom: false },
      endDateRange: { week: false, month: false, custom: false },
      createTimeRange: { week: false, month: false, custom: false },
      completeTimeRange: { week: false, month: false, custom: false },
    },
    setCheckedState: async (info) => {
      set({ checkedState: info });
    },
    clearCheckedState: async () => {
      set({
        checkedState: {
          beginDateRange: { week: false, month: false, custom: false },
          endDateRange: { week: false, month: false, custom: false },
          createTimeRange: { week: false, month: false, custom: false },
          completeTimeRange: { week: false, month: false, custom: false },
        },
      });
    },
    clear: async () => {
      set({
        searchData: {},
        statusList: [],
        ownerUserIdList: [],
        districtCodes: [],
        cityCodes: [],
        provinceCodes: [],
        isNationwide: false,
        isCityAll: false,
        date: {
          beginDateRange: {
            from: '',
            to: '',
          },
          endDateRange: {
            from: '',
            to: '',
          },
          createTimeRange: { from: '', to: '' },
          completeTimeRange: { from: '', to: '' },
        },
      });
    },
    clear1: async () => {
      const { searchData } = get();
      set({
        searchData: { ...searchData, statusList: [] },
        statusList: [],
      });
    },
    clear2: async () => {
      const { searchData } = get();
      set({
        searchData: { ...searchData, ownerUserIdList: [] },
        ownerUserIdList: [],
      });
    },
    clear3: async () => {
      const { searchData } = get();
      set({
        searchData: { ...searchData, districtCodes: [], cityCodes: [], provinceCodes: [] },
        districtCodes: [],
        cityCodes: [],
        provinceCodes: [],
        isNationwide: false,
        isCityAll: false,
      });
    },
    clear4: async () => {
      const { searchData } = get();
      set({
        searchData: {
          ...searchData,
          date: {
            beginDateRange: {
              from: '',
              to: '',
            },
            endDateRange: {
              from: '',
              to: '',
            },
            createTimeRange: { from: '', to: '' },
            completeTimeRange: { from: '', to: '' },
          },
        },
        date: {
          beginDateRange: {
            from: '',
            to: '',
          },
          endDateRange: {
            from: '',
            to: '',
          },
          createTimeRange: { from: '', to: '' },
          completeTimeRange: { from: '', to: '' },
        },
        checkedState: {
          beginDateRange: { week: false, month: false, custom: false },
          endDateRange: { week: false, month: false, custom: false },
          createTimeRange: { week: false, month: false, custom: false },
          completeTimeRange: { week: false, month: false, custom: false },
        },
      });
    },
  };
});
