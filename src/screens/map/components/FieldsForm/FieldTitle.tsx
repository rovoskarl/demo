import { Close, ExclamationMark } from '@/src/icons';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Sheet, Text, View, XStack, YStack } from 'tamagui';

export const FieldTitle = ({
  required,
  fieldName,
  description,
}: {
  required?: boolean;
  fieldName: string;
  description?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <YStack>
        <XStack alignItems="center" space={4}>
          <Text color={'#141414'}>{fieldName}</Text>
          {required ? <Text className="text-red-600">*</Text> : null}
          {description ? (
            <TouchableOpacity onPress={() => setOpen(true)}>
              <ExclamationMark />
            </TouchableOpacity>
          ) : null}
        </XStack>
      </YStack>
      {description ? (
        <Sheet open={open} snapPointsMode="percent" snapPoints={[50]} onOpenChange={setOpen} disableDrag modal>
          <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
          <Sheet.Frame padding={12} backgroundColor={'white'}>
            <XStack justifyContent="space-between">
              <View width={12} />
              <View className="text-center" marginTop={8}>
                <Text fontSize={16} fontWeight={'bold'}>
                  提示
                </Text>
              </View>

              <TouchableOpacity onPress={() => setOpen(false)}>
                <Close />
              </TouchableOpacity>
            </XStack>
            <View marginTop={12} paddingHorizontal={8}>
              <Text>{description}</Text>
            </View>
          </Sheet.Frame>
        </Sheet>
      ) : null}
    </>
  );
};
