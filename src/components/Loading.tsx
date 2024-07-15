import { View } from 'react-native';
import { Spinner } from 'tamagui';

export const Loading = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Spinner size="large" color="$primaryLight" />
    </View>
  );
};
