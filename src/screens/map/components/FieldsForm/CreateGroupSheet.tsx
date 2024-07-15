import { Input, Sheet, SheetProps, Text, XStack, YStack } from 'tamagui';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';

export const CreateGroupSheet = (props: SheetProps & { addGroup: (data: { name: string }) => void }) => {
  const [inputValue, setInputValue] = useState('');

  return (
    <Sheet dismissOnOverlayPress={false} animation="medium" modal snapPoints={[60]} native {...props}>
      <Sheet.Overlay animation="medium" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Frame flex={1}>
        <Sheet.ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
          <YStack borderRadius="$2" padding={16} backgroundColor="#F5F5F5">
            <XStack space="$2" marginBottom={24} justifyContent="space-between">
              <TouchableOpacity onPress={() => props.onOpenChange?.(false)}>
                <Text className="text-secondary-title text-base">取消</Text>
              </TouchableOpacity>
              <Text className="text-black text-base font-medium">创建新分组</Text>
              <TouchableOpacity onPress={() => props.addGroup?.({ name: inputValue })}>
                <Text className="text-primary text-base">完成</Text>
              </TouchableOpacity>
            </XStack>
            <Input
              autoFocus={true}
              value={inputValue}
              placeholder="分组名称"
              onChangeText={setInputValue}
              className="white rounded-lg h-12 p-3 text-black text-base"
            />
          </YStack>
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
};
