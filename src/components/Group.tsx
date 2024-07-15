import { RouteNames } from '@/src/navigation';
import { ImageSourcePropType, TouchableWithoutFeedback, View, Text, Image } from 'react-native';

type Action = {
  route: RouteNames | string;
  title: string;
  image: ImageSourcePropType;
};

interface Props {
  title: string;
  onExtra?: () => void;
  actions?: Action[];
  onItemPress?: (action: Action) => void;
}

export function Group({ title, onExtra, actions, onItemPress }: Props) {
  return (
    <View className="bg-white rounded-xl">
      <View className="flex-row justify-between items-center px-4 pt-3">
        <Text className="text-base font-semibold text-black">{title}</Text>
        {onExtra && (
          <TouchableWithoutFeedback>
            <View className="p-2 rounded bg-black">
              <Text className="text-white font-normal text-xs">编辑</Text>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
      <View
        style={{
          gap: 37,
        }}
        className="flex-row flex-wrap mt-4 px-2 pb-3 mb-3"
      >
        {(actions ?? []).map((action) => (
          <TouchableWithoutFeedback key={action.title} onPress={() => onItemPress?.(action)}>
            <View className="items-center">
              <Image resizeMode="contain" source={action.image} />
              <Text className="text-black mt-2">{action.title}</Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>
    </View>
  );
}
