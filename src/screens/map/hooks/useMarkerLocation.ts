import { create } from 'zustand';

type MarkerLocationState = Record<string, any>;

export const useMarkerLocation = create<MarkerLocationState>((set) => ({
  markerLocationDetail: {},
  setMarkerLocationDetail: (detail: Record<string, any>) => {
    set({ markerLocationDetail: detail });
  },
}));

export const useCustomFieldGroupId = create<MarkerLocationState>((set) => ({
  customFieldGroupId: '',
  setCustomFieldGroupId: (id: string) => {
    set({ customFieldGroupId: id });
  },
}));

export const useCustomFieldGroup = create<MarkerLocationState>((set) => ({
  customFieldGroup: [],
  setCustomFieldGroup: (group: any[]) => {
    set({ customFieldGroup: group });
  },
}));
