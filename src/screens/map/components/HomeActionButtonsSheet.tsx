import { TouchableOpacity } from 'react-native';
import {} from '@/src/icons';
import { ROUTER_FLAG, ScreenNavigationProp } from '@/src/navigation';
import { useNavigation } from '@react-navigation/native';
import { Image, XStack, YStack, Text, View } from 'tamagui';
import { WithAuth } from '@/src/components';
import { ButtonPermission } from '../constant/constants';
import { useLocation, useRenderType } from '../hooks';

export const HomeActionButtonsSheet = WithAuth((props: any) => {
  const { permissions, mapViewRef } = props;
  const hasMapMarkerLocation = permissions?.find((item: any) => item.url === ButtonPermission.MapMarkerLocation);
  const hasExpandPunter = permissions?.find((item: any) => item.url === ButtonPermission.ExpandPunter);
  const hasMapOperationRecord = permissions?.find((item: any) => item.url === ButtonPermission.MapOperationRecord);
  const navigation = useNavigation<ScreenNavigationProp>();
  const { update } = useRenderType();
  const {
    location: { latitude, longitude },
  } = useLocation();

  if (!hasMapMarkerLocation && !hasExpandPunter && !hasMapOperationRecord) {
    return null;
  }
  return (
    <View
      position="absolute"
      bottom={0}
      backgroundColor={'#ffffff'}
      width="100%"
      paddingHorizontal={40}
      paddingBottom={22}
      paddingTop={16}
      borderTopLeftRadius={24}
      borderTopRightRadius={24}
    >
      <XStack justifyContent="space-between" height="100%">
        {hasMapMarkerLocation ? (
          <YStack alignItems="center" justifyContent="center">
            <TouchableOpacity
              onPress={() => {
                mapViewRef.current?.moveCamera(
                  {
                    zoom: 16.5,
                    target: { latitude, longitude },
                  },
                  100,
                );
                update('markerLocation');
              }}
            >
              <Image source={require('../images/location.png')} marginBottom={8} />
            </TouchableOpacity>
            <Text fontSize={12}>标记位置</Text>
          </YStack>
        ) : null}

        {hasExpandPunter ? (
          <YStack alignItems="center" justifyContent="center">
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(ROUTER_FLAG.ExpandPunter);
              }}
            >
              <Image source={require('../images/acquisition.png')} marginBottom={8} />
            </TouchableOpacity>
            <Text fontSize={12}>一键拓客</Text>
          </YStack>
        ) : null}

        {hasMapOperationRecord ? (
          <YStack alignItems="center" justifyContent="center">
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(ROUTER_FLAG.MapOperationRecord);
              }}
            >
              <Image source={require('../images/history.png')} marginBottom={8} />
            </TouchableOpacity>
            <Text fontSize={12}>操作记录</Text>
          </YStack>
        ) : null}

        {/* <YStack alignItems="center" justifyContent="center">
          <TouchableOpacity onPress={() => {}}>
            <Image source={require('../images/measure.png')} marginBottom={3} />
          </TouchableOpacity>
          <Text fontSize={12}>测距</Text>
        </YStack> */}
      </XStack>
    </View>
  );
});
