import { create } from 'zustand';

type Props = {
  positionInfo: Record<string, any>;
  setPositionInfo: (positionInfo: Record<string, any>) => void;
};

export const usePosition = create<Props>((set) => ({
  positionInfo: {},

  setPositionInfo: (positionInfo) => {
    set({
      positionInfo,
    });
  },
}));
