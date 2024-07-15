import { EmptyImage } from '@/src/icons';
import { Text, YStack } from 'tamagui';

export const Empty = () => {
  return (
    <YStack className="w-full" alignItems="center" space={8} justifyContent="center">
      <EmptyImage />
      <Text color={'#858585'}>暂无数据</Text>
    </YStack>
  );
};
