import { SafeAreaView } from 'react-native';
import { Image, Text, XStack, YStack, View } from 'tamagui';
import { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ROUTER_FLAG, ScreenNavigationProp } from '@/src/navigation';
import { useService } from './hooks/useService';

export function AgentScreen() {
  const { getTaskCount, getTaskCollectionCount } = useService();
  const [count, setCount] = useState(0);
  const [collectionCount, setCollectionCount] = useState(0);
  const navigation = useNavigation<ScreenNavigationProp>();

  useFocusEffect(
    useCallback(() => {
      Promise.all([getTaskCount(), getTaskCollectionCount()]).then(([res1, res2]) => {
        setCount(res1?.todoCount || 0);
        setCollectionCount(res2);
      });
    }, [getTaskCollectionCount, getTaskCount]),
  );

  return (
    <SafeAreaView className="flex-1">
      <View className="w-full h-full" backgroundColor="$white" borderTopWidth={1} borderColor="#F0F0F0" padding={12}>
        <XStack gap={15}>
          <XStack
            flex={1}
            backgroundColor="#FAFAFA"
            borderRadius={12}
            paddingHorizontal={15}
            paddingVertical={8}
            alignItems="center"
            justifyContent="center"
            onPress={() => {
              navigation.navigate(ROUTER_FLAG.Approval);
            }}
          >
            <Image source={require('@/src/screens/agent/images/approval.png')} />
            <YStack>
              <XStack>
                <Text fontSize={20} lineHeight={28} fontWeight="500" color="#141414">
                  {count}
                </Text>
                {count > 0 ? (
                  <View width={5} marginTop={5} height={5} backgroundColor="#E24A4A" borderRadius={5} />
                ) : null}
              </XStack>

              <Text fontSize={13} color="#5E5E5E" lineHeight={21} fontWeight="400">
                审核任务
              </Text>
            </YStack>
          </XStack>
          <XStack
            flex={1}
            backgroundColor="#FAFAFA"
            borderRadius={12}
            paddingHorizontal={15}
            paddingVertical={8}
            alignItems="center"
            justifyContent="center"
            onPress={() => {
              navigation.navigate(ROUTER_FLAG.MapCollections);
            }}
          >
            <Image source={require('@/src/screens/agent/images/approval.png')} />
            <YStack>
              <Text fontSize={20} lineHeight={28} fontWeight="500" color="#141414">
                {collectionCount}
              </Text>
              <Text fontSize={13} color="#5E5E5E" lineHeight={21} fontWeight="400">
                采集任务
              </Text>
            </YStack>
          </XStack>
        </XStack>
      </View>
    </SafeAreaView>
  );
}
