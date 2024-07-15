import { create } from 'zustand';

type Props = {
  token?: Record<string, any>;
  initToken: (token: any) => void;
};

export const useOSSToken = create<Props>((set) => {
  return {
    token: undefined,

    initToken: (token) => {
      set({
        token,
      });
    },
  };
});
