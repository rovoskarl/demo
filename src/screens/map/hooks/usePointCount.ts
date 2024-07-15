import { create } from 'zustand';

export const usePointCount = create((set) => ({
  counts: {
    mapPositionCount: 0,
    poiPositionCount: 0,
    shopPositionCount: 0,
  },
  showCount: {
    poi: false,
    shop: false,
    position: false,
  },
  setCounts: (counts: any) => {
    set({ counts });
  },
  setShowCount: (showCount: any) => {
    set({ showCount });
  },
}));
