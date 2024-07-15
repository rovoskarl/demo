import { create } from 'zustand';

type MapInfoState = {
  ref: any;
  setRef: (ref: any) => void;
};

export const useMarkerRef = create<MapInfoState>((set) => ({
  ref: null,
  setRef: (ref) => {
    set({ ref });
  },
}));
