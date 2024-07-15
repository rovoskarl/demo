import { View, Text } from 'react-native';
import { Spinner } from 'tamagui';
import { CircleSuccess } from '@/src/icons';
import { GroupManage } from '../constant/label';

export const ExpandGroupViewToast = (props: any) => {
  const { type = 'loading', tip = GroupManage.loadingTip } = props;
  return (
    <View className="absolute w-full h-full flex flex-1 z-30 items-center justify-center justify-items-center">
      <View className="w-32 h-28 rounded-sm rounded-xl" style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}>
        <View className="flex flex-row mt-6 content-center justify-center">
          {type === 'success' ? (
            <CircleSuccess />
          ) : type === 'loading' ? (
            <Spinner size="large" color="$primaryLight" />
          ) : null}
        </View>
        <Text className="text-white leading-10 text-center text-base mt-2">{tip}</Text>
      </View>
    </View>
  );
};
