import { Delete, Search } from '@/src/icons';
import { View, Text, TouchableOpacity } from 'react-native';
import { ListItem, Separator, XStack, YGroup, YStack } from 'tamagui';

export const SearchHistory = ({
  searchHistory,
  clearSearchHistory,
  onSearch,
}: {
  searchHistory: any[];
  clearSearchHistory: () => void;
  onSearch: (text: string) => void;
}) => {
  return (
    <YStack marginHorizontal={12} marginBottom={12} borderRadius={8} alignItems="center">
      <YGroup separator={<Separator />} marginBottom="$8" backgroundColor="$white">
        {searchHistory?.map((item, index) => {
          return (
            <YGroup.Item key={item + index}>
              <TouchableOpacity onPress={() => onSearch(item)}>
                <ListItem
                  icon={<Search width={16} height={16} color="#141414" />}
                  title={item}
                  backgroundColor="white"
                  borderRadius={8}
                />
              </TouchableOpacity>
            </YGroup.Item>
          );
        })}

        <YGroup.Item>
          <TouchableOpacity onPress={clearSearchHistory}>
            <ListItem backgroundColor="white" alignItems="center" textAlign="center" borderRadius={8}>
              <View className="w-full items-center">
                <XStack space="$1">
                  <Text className="text-secondary-paragraph-dark">清空历史记录</Text>
                  <Delete />
                </XStack>
              </View>
            </ListItem>
          </TouchableOpacity>
        </YGroup.Item>
      </YGroup>
    </YStack>
  );
};
