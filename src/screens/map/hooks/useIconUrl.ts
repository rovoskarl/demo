import { create } from 'zustand';

type Props = {
  key: number[];
  setKey: (key: number[], ref?: any) => void;
};

export const useIconUrl = create<Props>((set) => ({
  key: [1],
  setKey: (key, ref = null) => {
    if (ref) {
      setTimeout(() => {
        ref?.update();
      }, 1000);
    }

    set({ key });
  },
}));
