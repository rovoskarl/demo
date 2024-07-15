import { Check, Close, Right } from '@/src/icons';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Checkbox, Label, Sheet, Text, View, XStack, YStack } from 'tamagui';
import { useBusinessConfigDetail } from '../../hooks';

type IProps = {
  value: string[];
  onChange?: (value: string[]) => void;
};

export const ReasonSheet = ({ value, onChange }: IProps) => {
  const [open, setOpen] = useState(false);
  const { businessConfigDetail } = useBusinessConfigDetail();

  return (
    <View marginTop={8}>
      <TouchableOpacity onPress={() => setOpen(true)}>
        <XStack alignItems="center" justifyContent="space-between" space="$2">
          <View>
            <Text color="#5E5E5E">{value?.join('；') || '请选择'}</Text>
          </View>

          <Right color="#5E5E5E" />
        </XStack>
      </TouchableOpacity>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        dismissOnOverlayPress={false}
        animation="medium"
        modal
        snapPoints={[50]}
        native
      >
        <Sheet.Overlay animation="medium" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Sheet.Frame padding={12} backgroundColor={'white'}>
          <XStack justifyContent="space-between">
            <View width={12} />
            <View className="text-center" marginTop={8}>
              <Text fontSize={16} fontWeight={'bold'}>
                不通过原因
              </Text>
            </View>

            <TouchableOpacity onPress={() => setOpen(false)}>
              <Close />
            </TouchableOpacity>
          </XStack>
          <Sheet.ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
            <YStack space="$2">
              {businessConfigDetail?.reasonList?.map((item, index) => {
                const id = item.reason + index;
                return (
                  <XStack space="$4" key={id}>
                    <Checkbox
                      size="$5"
                      id={id}
                      borderRadius={0}
                      value={item.reason}
                      backgroundColor="$white"
                      onCheckedChange={(checked) => {
                        onChange?.(
                          checked ? [...(value || []), item.reason] : value?.filter((i: string) => i !== item.reason),
                        );
                      }}
                    >
                      <Checkbox.Indicator style={{ backgroundColor: '#00BBB4' }}>
                        <Check color="#fff" width="22" height="22" />
                      </Checkbox.Indicator>
                    </Checkbox>

                    <Label flex={1} htmlFor={id} color={'#5e5e5e'}>
                      {item.reason}
                    </Label>
                  </XStack>
                );
              })}
            </YStack>
          </Sheet.ScrollView>
        </Sheet.Frame>
      </Sheet>
    </View>
  );
};
