import { create } from 'zustand';

type ShowConfigState = {
  config: { isShowName: boolean; isShowAdministrative: boolean; isKeep: boolean; mapType: number };
  update: (info: ShowConfigState['config']) => Promise<void>;
};

export const useShowConfig = create<ShowConfigState>((set) => ({
  config: {
    isShowAdministrative: false,
    isShowName: true,
    isKeep: false,
    mapType: 1,
  },

  update: async (config) => {
    set({ config });
  },
}));
