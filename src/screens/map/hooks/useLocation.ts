import { PermissionsAndroid, Platform } from 'react-native';
import { Linking } from 'react-native';
import { init, Geolocation } from 'react-native-amap-geolocation';
import { LatLng, MapView } from '@tastien/react-native-amap3d';
import Config from 'react-native-config';
import { create } from 'zustand';
import { Toast, ToastToken } from '@/src/interfaces/notifications';
import { useDependency } from '@/src/ioc';
import { computeDistance } from '@/src/utils';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';

type LocationInfoState = {
  location: LatLng;
  locationInfo: Record<string, any>;
  moveCameraWithLocation: (mapViewRef: React.RefObject<MapView>) => Promise<void>;
  setLocation: (location: LatLng) => void;
  distance: string;
  getDistance: (position: LatLng) => void;
  setLocationInfo: (locationInfo: Record<string, any>) => void;
};

function gcj02ToBd09(lng: any, lat: any) {
  var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * Math.PI);
  var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * Math.PI);
  var bd_lng = parseFloat((z * Math.cos(theta) + 0.0065).toFixed(6));
  var bd_lat = parseFloat((z * Math.sin(theta) + 0.006).toFixed(6));
  return [bd_lng, bd_lat];
}

export const useLocation = create<LocationInfoState>((set) => ({
  locationInfo: {},
  location: {
    latitude: 39.91095,
    longitude: 116.37296,
  },
  distance: '0',
  moveCameraWithLocation: async (mapViewRef: React.RefObject<MapView>) => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);
    } else {
      const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      console.log(result, 'result');
      if (result !== RESULTS.GRANTED) {
        return;
      }
    }
    init({
      android: Config.APP_TD_AMAP_ANDROID_KEY,
      ios: Config.APP_TD_AMAP_IOS_KEY,
    }).then(() => {
      Geolocation.getCurrentPosition(({ coords }) => {
        set({
          location: { latitude: coords.latitude, longitude: coords.longitude },
        });
        mapViewRef.current?.moveCamera(
          {
            zoom: 16.5,
            target: { latitude: coords.latitude, longitude: coords.longitude },
          },
          100,
        );
      });
    });
  },
  getDistance: (position) => {
    init({
      android: Config.APP_TD_AMAP_ANDROID_KEY,
      ios: Config.APP_TD_AMAP_IOS_KEY,
    }).then(() => {
      Geolocation.getCurrentPosition(({ coords }) => {
        const distance = computeDistance(position?.latitude, position?.longitude, coords?.latitude, coords?.longitude);
        set({
          distance: distance.toFixed(2),
        });
      });
    });
  },
  setLocationInfo: (locationInfo: Record<string, any>) => {
    set({
      locationInfo,
    });
  },
  setLocation: (location: LatLng) => {
    set({
      location: {
        latitude: parseFloat(location.latitude?.toFixed(6)),
        longitude: parseFloat(location.longitude?.toFixed(6)),
      },
    });
  },
}));

export const useGaodeNavigation = (item: any = {}) => {
  const { location } = useLocation();
  const toast = useDependency<Toast>(ToastToken);
  let aMapIosUrl = '';
  let bMapIosUrl = '';
  let aMapAndroidUrl = '';
  let bMapAndroidUrl = '';
  if (item?.latitude && item?.longitude) {
    const [originLng, originLat] = gcj02ToBd09(location?.longitude, location?.latitude);
    const [destLng, destLat] = gcj02ToBd09(item?.longitude, item?.latitude);
    aMapIosUrl = `iosamap://path?sourceApplication=塔塔工作台-拓店助手&dlat=${item?.latitude}&dlon=${item?.longitude}&slat=${location?.latitude}&slon=${location?.longitude}&dev=0&t=2`;
    aMapAndroidUrl = `androidamap://route/plan?sourceApplication=塔塔工作台-拓店助手&dlat=${item?.latitude}&dlon=${item?.longitude}&slat=${location?.latitude}&slon=${location?.longitude}&dev=0&t=2`;
    bMapIosUrl = `baidumap://map/direction?origin=${originLat},${originLng}&destination=${destLat},${destLng}&mode=walking`;
    bMapAndroidUrl = `bdapp://map/direction?origin=${originLat},${originLng}&destination=${destLat},${destLng}&mode=walking`;
  } else {
    const [originLng, originLat] = gcj02ToBd09(location?.longitude, location?.latitude);
    aMapIosUrl = `iosamap://path?sourceApplication=塔塔工作台-拓店助手&dlat=${location?.latitude}&dlon=${location?.longitude}&dev=0&t=2`;
    aMapAndroidUrl = `androidamap://route/plan?sourceApplication=塔塔工作台-拓店助手&dlat=${location?.latitude}&dlon=${location?.longitude}&dev=0&t=2`;
    bMapAndroidUrl = `bdapp://map/direction?destination=${originLat},${originLng}&mode=walking&src=com.tastien.smart_helper`;
    bMapIosUrl = `baidumap://map/direction?destination=${originLat},${originLng}&mode=walking&src=com.tastien.smart_helper`;
  }

  const openGaodeMap = () => {
    const gaodeAppUrl = Platform.OS === 'ios' ? aMapIosUrl : aMapAndroidUrl;

    Linking.canOpenURL(gaodeAppUrl)
      .then((supported) => {
        if (!supported && Platform.OS !== 'android') {
          toast.show('高德地图未安装');
        } else {
          return Linking.openURL(gaodeAppUrl);
        }
      })
      .catch((err) => console.error('打开高德地图出错', err));
  };

  const openBaiduMap = () => {
    const baiduAppUrl = Platform.OS === 'ios' ? bMapIosUrl : bMapAndroidUrl;

    Linking.canOpenURL(baiduAppUrl)
      .then((supported) => {
        if (!supported && Platform.OS !== 'android') {
          toast.show('百度地图未安装');
        } else {
          return Linking.openURL(baiduAppUrl);
        }
      })
      .catch((err) => console.error('打开百度地图出错', err));
  };
  return {
    openGaodeMap,
    openBaiduMap,
  };
};
