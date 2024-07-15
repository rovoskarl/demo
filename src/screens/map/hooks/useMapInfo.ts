import { create } from 'zustand';

type MapInfoState = {
  mapInfo: Record<string, any>;
  updateMapInfo: (info: Record<string, any>) => Promise<void>;
};

export const useMapInfo = create<MapInfoState>((set) => ({
  mapInfo: {},
  updateMapInfo: async (info) => {
    set({ mapInfo: info });
  },
}));
