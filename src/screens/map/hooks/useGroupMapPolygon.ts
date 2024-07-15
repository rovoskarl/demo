import { create } from 'zustand';
import { PolygonSelectionState } from '../definition/polygonPointDefinition';
import { useGroupMapSelection } from '../hooks';
import { useToast } from './useToast';
import { LatLng } from '@tastien/react-native-amap3d';
import { getUniqueArray } from '../../../utils/tools';
import { cloneDeep } from 'lodash-es';

/**
 * @store         useGroupMapPolygon
 * @description   地图点位store
 * @returns       Object
 */
export const useGroupMapPolygon = create<PolygonSelectionState>((set, get) => ({
  polygonItem: [],
  setPolygonItem: (polygonItem: LatLng[]) => {
    set({ polygonItem });
  },
  getPolygonItem: () => {
    return get().polygonItem;
  },
}));

/**
 * @hook          useGroupMapPointCalculate
 * @description   地图点位hook
 * @returns       Object
 */
export const useGroupMapPointCalculate = () => {
  const { toast } = useToast();
  const { pointerList, pointerIds, setPointerList, setPointerIds } = useGroupMapSelection();

  const isPointInPolygon = (
    point: { latitude: number; longitude: number },
    polygon: { latitude: number; longitude: number }[],
  ): boolean => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].latitude,
        yi = polygon[i].longitude;
      const xj = polygon[j].latitude,
        yj = polygon[j].longitude;

      const intersect =
        yi > point.longitude !== yj > point.longitude &&
        point.latitude < ((xj - xi) * (point.longitude - yi)) / (yj - yi) + xi;
      if (intersect) {
        inside = !inside;
      }
    }
    return inside;
  };

  /**
   * @method                  pathToPolygonPoint
   * @description             坐标转为经纬度
   * @param pathsPoints
   * @param latLngBounds
   * @param canvasSize
   * @returns
   */
  const pathToPolygonPoint = (pathsPoints: string[], latLngBounds: any, canvasSize: any) => {
    const pathsInLatLng = pathsPoints.map((path: any) => {
      const [x, y] = path.split(',').map(Number);
      const latitude =
        latLngBounds.southwest.latitude +
        (latLngBounds.northeast.latitude - latLngBounds.southwest.latitude) * (1 - y / canvasSize.height);
      const longitude =
        latLngBounds.southwest.longitude +
        ((latLngBounds.northeast.longitude - latLngBounds.southwest.longitude) * x) / canvasSize.width;
      return { latitude, longitude };
    });
    return pathsInLatLng;
  };

  /**
   * @method              validSelectedPoint
   * @description         校验及筛选选择点位
   * @param               {Object}      polygonPoint
   * @param               {Array}       positionList
   * @returns
   */
  const validSelectedPoint = (polygonPoint: { latitude: number; longitude: number }[], positionList: any[]) => {
    if (polygonPoint.length) {
      let selectedPosition: Record<string, any>[] = [];
      selectedPosition = positionList.filter((item) => {
        return isPointInPolygon(item, polygonPoint);
      });
      if (selectedPosition.length === 0) {
        toast.show('圈选的资源为空');
        return false;
      }
      if (selectedPosition.length > 200) {
        toast.show('选择点位不超过200个');
        return false;
      }
      selectedPosition.forEach((item) => {
        item.check = true;
      });

      let pointerConcatList = cloneDeep(pointerList.concat(selectedPosition));
      pointerConcatList = getUniqueArray(pointerConcatList, 'id');
      setPointerList(pointerConcatList);
      const clonePointIds = cloneDeep([...pointerIds, ...pointerConcatList.map(({ id }: any) => id)]);
      let pointIds = Array.from(new Set(clonePointIds));
      setPointerIds(pointIds);
      return true;
    }
  };

  return {
    isPointInPolygon,
    validSelectedPoint,
    pathToPolygonPoint,
  };
};
