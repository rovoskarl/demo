import { View, Text, XStack, Separator, YStack } from 'tamagui';
import { pinMapStatusNames } from '../types';
import { Empty } from './Empty';
import { primary, secondary, split } from '@/src/components/Theme/colors';
import { useCollectionsTaskDetail } from '../hooks';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ROUTER_FLAG, ScreenNavigationProp } from '@/src/navigation';
import { useNavigation } from '@react-navigation/native';
import { useLocation, usePosition } from '../../map/hooks';

export const SubmitPinMap = () => {
  const { submitPinMapInfo } = useCollectionsTaskDetail();
  const navigation = useNavigation<ScreenNavigationProp>();
  const { setPositionInfo } = usePosition();
  const { setLocation } = useLocation();

  return submitPinMapInfo ? (
    <TouchableOpacity
      onPress={() => {
        setPositionInfo(submitPinMapInfo);
        setLocation({ latitude: submitPinMapInfo?.latitude, longitude: submitPinMapInfo?.longitude });
        navigation.navigate(ROUTER_FLAG.MapPointDetail, {
          latitude: submitPinMapInfo?.latitude,
          longitude: submitPinMapInfo?.longitude,
        });
      }}
    >
      <View className="bg-white m-3 p-3 rounded-lg">
        <XStack justifyContent="space-between" alignItems="center">
          <Text className="font-medium leading-6">{submitPinMapInfo?.name}</Text>
          <Text className="leading-6" color={primary.DEFAULT}>
            {pinMapStatusNames[submitPinMapInfo?.status as keyof typeof pinMapStatusNames]}
          </Text>
        </XStack>
        <Separator marginVertical={15} borderColor={split.DEFAULT} />
        <YStack>
          <Text className="font-medium leading-6">
            {[submitPinMapInfo?.province, submitPinMapInfo?.city, submitPinMapInfo?.district].join(' ')}
          </Text>
          <Text className="leading-6" color={secondary.paragraph.dark}>
            {submitPinMapInfo.address}
          </Text>
        </YStack>
      </View>
    </TouchableOpacity>
  ) : (
    <Empty />
  );
};
