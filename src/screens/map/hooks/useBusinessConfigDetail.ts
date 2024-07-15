import { create } from 'zustand';

export type BusinessConfigDTO = {
  id: number;
  name: string;
  templateId: number;
  flowNo: string;
  punchRange: number;
  reasonList: { isSystem: boolean; reason: string }[];
};

type IProps = {
  businessConfigDetail?: BusinessConfigDTO;
  setBusinessConfigDetail: (businessConfigDetail: BusinessConfigDTO) => void;
};

export const useBusinessConfigDetail = create<IProps>((set) => ({
  businessConfigDetail: undefined,

  setBusinessConfigDetail: (businessConfigDetail: BusinessConfigDTO) => {
    set({ businessConfigDetail });
  },
}));
