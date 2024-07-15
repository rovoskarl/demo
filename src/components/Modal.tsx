import { FC } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Sheet, XStack, Text } from 'tamagui';

interface Props {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCanceled: () => void;
  onCompleted?: () => void;
  children: React.ReactNode;
  title?: string;
  snapPoints?: (number | string)[];
  snapPointsMode?: 'percent' | 'constant' | 'fit' | 'mixed';
  disableDrag?: boolean;
  showCancel?: boolean;
}

export const Modal: FC<Props> = ({
  open,
  title,
  onOpenChange,
  onCanceled,
  onCompleted,
  children,
  snapPointsMode = 'fit',
  snapPoints,
  disableDrag,
  showCancel = true,
}) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      animation="medium"
      snapPointsMode={snapPointsMode}
      snapPoints={snapPoints}
      disableDrag={disableDrag}
    >
      <Sheet.Overlay />
      <Sheet.Frame backgroundColor="$white" marginBottom={bottom}>
        <XStack alignItems="center" justifyContent={'space-between'} paddingVertical="$3">
          {showCancel && (
            <Button
              chromeless
              color="$black6Light"
              fontSize={14}
              fontWeight="400"
              pressStyle={{
                backgroundColor: 'transparent',
                borderColor: '$white',
              }}
              onPress={onCanceled}
            >
              取消
            </Button>
          )}
          <Text color="$black8Light" fontSize={14} fontWeight="500">
            {title}
          </Text>
          <Button
            chromeless
            color="$primaryLight"
            fontSize={14}
            fontWeight="400"
            pressStyle={{
              backgroundColor: 'transparent',
              borderColor: '$white',
            }}
            onPress={onCompleted && onCompleted}
          >
            {!onCompleted ? '' : '确认'}
          </Button>
        </XStack>
        {children}
      </Sheet.Frame>
    </Sheet>
  );
};
