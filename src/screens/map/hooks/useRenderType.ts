import { create } from 'zustand';

type RenderTypeState = {
  type: 'home' | 'markerLocation' | 'list' | 'nearPosition';
  update: (type: RenderTypeState['type']) => Promise<void>;
};

export const useRenderType = create<RenderTypeState>((set) => ({
  type: 'home',

  update: async (type) => {
    set({ type });
  },
}));
