import { LatLng } from '@tastien/react-native-amap3d';

export type PolygonSelectionState = {
  polygonItem: LatLng[];
  setPolygonItem: (polygonItem: LatLng[]) => void;
  getPolygonItem: () => LatLng[];
};
