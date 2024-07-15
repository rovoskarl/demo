import { ROUTER_FLAG, ScreenNavigationProp } from '@/src/navigation';
import { useNavigation } from '@react-navigation/native';
import { Button, Text, View, YStack } from 'tamagui';
import { useRenderType } from './hooks';
import { Close } from '@/src/icons';
import { NearPosition } from './components';
import { TouchableOpacity } from 'react-native';

export const MapNearPosition: React.FC = () => {
  const { update } = useRenderType();

  const navigation = useNavigation<ScreenNavigationProp>();

  const onCollectInfo = () => {
    navigation.navigate(ROUTER_FLAG.MapMarkerLocationInfo);
  };

  return (
    <YStack className=" bg-white h-3/6">
      <View className="absolute right-3 top-3 z-10">
        <TouchableOpacity
          onPress={() => {
            update('markerLocation');
          }}
        >
          <Close />
        </TouchableOpacity>
      </View>
      <YStack className="m-3 flex-1">
        <View className="flex-1 mb-3">
          <NearPosition />
        </View>

        <Button className="h-10 bg-primary" onPress={() => onCollectInfo()}>
          <Text color={'white'} fontSize={16} fontWeight={'500'}>
            采集信息
          </Text>
        </Button>
      </YStack>
    </YStack>
  );
};
