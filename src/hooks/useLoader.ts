import { create } from 'zustand';

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export const useLoader = create<Props>((set) => ({
  visible: false,
  setVisible: (visible) => {
    set({ visible });
  },
}));
