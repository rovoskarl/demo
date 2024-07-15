import { UserStore } from '@/src/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export const useBrandInfo = () => {
  const [brandInfo, setBrandInfo] = useState({ brandId: '', brandName: '' });

  useEffect(() => {
    (async () => {
      const brand: any = await AsyncStorage.getItem(UserStore._BRAND_KEY);
      const info = JSON.parse(brand);
      if (info) {
        setBrandInfo(info);
      }
    })();
  }, []);
  return { ...brandInfo };
};
