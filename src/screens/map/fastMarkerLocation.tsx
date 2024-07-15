import * as React from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { MapView, Marker } from '@tastien/react-native-amap3d';
import { Back, NavigationSheet } from './components';
import { useEffect, useRef } from 'react';
import { useLocation, useRenderType } from './hooks';
import { ROUTER_FLAG, ScreenNavigationProp } from '@/src/navigation';
import { useNavigation } from '@react-navigation/native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Button, XStack, YStack } from 'tamagui';
import { Close } from '@/src/icons';

const defaultIcon = require('./images/markerLocationIconDefault.png');
export const MapFastMarkerLocationScreen = () => {
  const mapViewRef = useRef<MapView>(null);

  const navigation = useNavigation<ScreenNavigationProp>();
  const { distance, location, locationInfo, getDistance } = useLocation();
  const { update: updateType } = useRenderType();
  useEffect(() => {
    if (location) {
      getDistance(location);
    }
  }, [getDistance, location]);
  return (
    <SafeAreaView className="relative">
      <View className="w-full h-full">
        <View className="w-full h-4/5">
          <MapView
            zoomGesturesEnabled={false}
            scrollGesturesEnabled={false}
            compassEnabled={false}
            initialCameraPosition={{ zoom: 19, target: location }}
            ref={mapViewRef}
          >
            <Marker position={location}>
              <View style={{ padding: 5, width: 30, height: 35 }}>
                <Image source={defaultIcon as any} style={{ width: '100%', height: '100%' }} />
              </View>
            </Marker>
          </MapView>
        </View>

        <Back />

        <View className="flex-1">
          <BottomSheet snapPoints={['100%']} handleStyle={{ display: 'none' }}>
            <BottomSheetView style={{ flex: 1 }}>
              <YStack padding="$4" space="$2">
                <XStack justifyContent="space-between">
                  <Text className="text-black text-lg font-medium max-w-xs" ellipsizeMode="tail" numberOfLines={1}>
                    {locationInfo?.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.goBack();
                    }}
                  >
                    <Close />
                  </TouchableOpacity>
                </XStack>
                <XStack className="w-8/12" space="$2">
                  <Text className="text-secondary-paragraph-dark text-sm">距你 {distance} 公里</Text>
                  <Text className="text-secondary-paragraph-dark text-sm" numberOfLines={1} ellipsizeMode="tail">
                    {locationInfo?.address}
                  </Text>
                </XStack>
                <XStack space="$2">
                  <NavigationSheet variant="outlined" color="black" />
                  <Button
                    flex={1}
                    backgroundColor="#00BBB4"
                    color="$white"
                    onPress={() => {
                      updateType('markerLocation');
                      navigation.navigate(ROUTER_FLAG.Home);
                    }}
                  >
                    标记位置
                  </Button>
                </XStack>
              </YStack>
            </BottomSheetView>
          </BottomSheet>
        </View>
      </View>
    </SafeAreaView>
  );
};
