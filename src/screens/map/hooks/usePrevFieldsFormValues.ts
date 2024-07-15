import { create } from 'zustand';

type PrevFieldsFormValuesState = {
  prevValues: Record<string, any>;
  setPrevValues: (values: Record<string, any>) => void;
  cleanPrevValues: () => void;
};

export const usePrevFieldsFormValues = create<PrevFieldsFormValuesState>((set) => ({
  prevValues: {},

  setPrevValues: (values: Record<string, any>) => {
    set({ prevValues: values });
  },

  cleanPrevValues: () => {
    set({ prevValues: {} });
  },
}));
