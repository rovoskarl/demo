import { Button, Text } from 'tamagui';
import { View } from 'react-native';
import { XStack, YStack } from 'tamagui';

export const ConfirmModal = (props: {
  cancelText?: string;
  confirmText?: string;
  mask?: boolean;
  tipTitle?: string;
  tipContent?: string;
  cancelHandler?: Function;
  confirmHandler?: Function;
}) => {
  const {
    cancelText = '取消',
    confirmText = '确定',
    mask = true,
    tipTitle = '提示',
    tipContent = '',
    cancelHandler,
    confirmHandler,
  } = props;
  return (
    <View
      className="w-full h-full z-30"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
      }}
    >
      {mask ? (
        <View
          className="absolute w-full"
          style={{ backgroundColor: 'rgba(0,0,0, 0.5)', zIndex: 1, height: '100%', bottom: 0 }}
        />
      ) : null}
      <YStack space="$2" borderRadius="$4" width={'80%'} backgroundColor="#FFF" className="items-center p-4 z-20">
        <Text className="text-lg font-bold">{tipTitle}</Text>
        <Text className="text-base mt-2 mb-2">{tipContent} </Text>
        <XStack>
          <View className="flex flex-row w-full content-center">
            <Button
              className="text-base"
              style={{ width: '44%', marginRight: '6%' }}
              onPress={() => {
                cancelHandler?.();
              }}
            >
              {cancelText}
            </Button>
            <Button
              backgroundColor="$primaryLight"
              color="$white"
              className="text-base"
              style={{ width: '44%' }}
              onPress={() => {
                confirmHandler?.();
              }}
            >
              {confirmText}
            </Button>
          </View>
        </XStack>
      </YStack>
    </View>
  );
};
