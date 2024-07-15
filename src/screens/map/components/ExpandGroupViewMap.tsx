import { View, Text, TouchableOpacity } from 'react-native';
import { ViewMap } from '@/src/icons';
import { GroupManage } from '../constant/label';

export const ExpandGroupViewMap = (props: { clickHandler: Function }) => {
  return (
    <View
      style={{ shadowColor: '#000' }}
      className="absolute w-32 h-10 z-20 right-8 bottom-56 border-1 bg-white rounded-3xl shadow-sm"
    >
      <TouchableOpacity
        onPress={() => {
          props?.clickHandler?.();
        }}
      >
        <View className="flex flex-row">
          <ViewMap />
          <Text className="text-teal-400 text-base leading-9 ml-2">{GroupManage.viewMapText}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
