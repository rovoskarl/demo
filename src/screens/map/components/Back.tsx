import { TouchableOpacity } from 'react-native';
import { Back as BackIcon } from '@/src/icons';
import { ScreenNavigationProp } from '@/src/navigation';
import { useNavigation } from '@react-navigation/native';
import { useIconUrl, useMarkerLocation } from '../hooks';

export const Back = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const { setKey } = useIconUrl();
  const { setMarkerLocationDetail } = useMarkerLocation();
  return (
    <TouchableOpacity
      onPress={() => {
        setMarkerLocationDetail({});
        setKey([1]);
        navigation.goBack();
      }}
      className="absolute top-4 left-4 bg-white rounded-3xl w-8 h-8 flex items-center justify-center"
    >
      <BackIcon />
    </TouchableOpacity>
  );
};
