import { View, Text } from 'react-native';

export const SearchEmpty = ({ text }: { text?: string }) => {
  return (
    <View className="w-full h-full bg-white rounded-[16] flex items-center justify-center">
      <Text className="color-secondary-paragraph-dark">{text ? text : '此搜索支持已标记内容和想搜索内容'}</Text>
    </View>
  );
};
