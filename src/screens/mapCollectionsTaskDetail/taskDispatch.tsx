import { Back } from '@/src/icons';
import { ScreenNavigationProp } from '@/src/navigation';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useRef, useState } from 'react';
import { ActivityIndicator, SafeAreaView } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { View, Input, XStack, Button, Text, YStack, ListItem, YGroup, Separator } from 'tamagui';
import { useDispatchCollectionsTask, usePlatformUserList } from './hooks/useService';
import { ConfirmModal } from '../map/components';
import { GroupManage } from '../map/constant/label';

type TaskDispatchScreenProps = {
  TaskDispatch: { taskId: number };
};
export const TaskDispatchScreen = ({ route }: { route: RouteProp<TaskDispatchScreenProps, 'TaskDispatch'> }) => {
  const { taskId } = route.params;
  const [keyword, setKeyword] = useState('');
  const [selectedUser, setSelectedUser] = useState<{ userId: number; userName: string }>();

  const scrollViewRef = useRef<any>();
  const navigation = useNavigation<ScreenNavigationProp>();

  const { userList, hasMore, loadMore, onSearch, loading } = usePlatformUserList();
  const { run } = useDispatchCollectionsTask();

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;

    if (offsetY + scrollViewHeight >= contentHeight - 50 && !loading && hasMore) {
      loadMore();
    }
  };

  const onHandleSearch = () => {
    onSearch(keyword);
  };

  return (
    <>
      <SafeAreaView style={{ backgroundColor: '$white', flex: 1 }}>
        <YStack width={'100%'} height={'100%'}>
          <XStack
            backgroundColor="white"
            margin={12}
            borderRadius={8}
            alignItems="center"
            justifyContent="space-between"
            paddingLeft="$3"
            paddingRight="$2"
            height="$4.5"
          >
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Back />
            </TouchableOpacity>
            <Input
              borderWidth={0}
              flex={1}
              backgroundColor="white"
              placeholder="输入成员昵称"
              onChangeText={setKeyword}
              value={keyword}
              fontSize={16}
            />
            <Button
              backgroundColor="#00BBB4"
              width={56}
              height="$3"
              padding={0}
              size={16}
              color="white"
              onPress={onHandleSearch}
            >
              搜索
            </Button>
          </XStack>
          <View flex={1} height={'100%'} backgroundColor={'$white'} borderRadius={8}>
            <ScrollView
              ref={scrollViewRef}
              onScroll={handleScroll}
              scrollEventThrottle={30}
              showsHorizontalScrollIndicator={false}
            >
              <YGroup marginTop={4} separator={<Separator borderColor={'#F0F0F0'} />}>
                {userList.map((item) => (
                  <YGroup.Item key={item.userId}>
                    <ListItem
                      hoverTheme
                      pressTheme
                      onPress={() => setSelectedUser(item)}
                      backgroundColor={'$white'}
                      title={<Text className="text-sm font-normal leading-10">{item.userName}</Text>}
                    />
                  </YGroup.Item>
                ))}
              </YGroup>
              {loading ? <ActivityIndicator size="large" color="#cccccc" /> : null}
              {!hasMore ? (
                <Text textAlign="center" color="#5E5E5E" fontSize={12} margin="$3">
                  没有更多了
                </Text>
              ) : null}
            </ScrollView>
          </View>
        </YStack>
      </SafeAreaView>
      {selectedUser && (
        <ConfirmModal
          mask={true}
          tipContent={GroupManage.confirmDispatch}
          cancelHandler={() => {
            setSelectedUser(undefined);
          }}
          confirmHandler={async () => {
            await run({ taskId, ...selectedUser });
            navigation.goBack();
          }}
        />
      )}
    </>
  );
};
