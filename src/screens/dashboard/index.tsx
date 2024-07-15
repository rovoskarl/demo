import { Avatar, Text, XStack } from 'tamagui';
import { View } from 'react-native';
import { Container, FocusStatusBar, WithAuth } from '@/src/components';
import { Group } from '@/src/components/Group';
import { NavigatorRef, NavigatorToken, ROUTER_FLAG, RouterParams } from '@/src/navigation';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useLayoutEffect, useMemo } from 'react';
import { useDependency } from '@/src/ioc';
import { TrackerStore, UserStore } from '@/src/store';
import { observer } from 'mobx-react-lite';

type ScreenNavigationProp = StackNavigationProp<RouterParams>;

const isValidUrl = (str: string) => {
  const pattern = new RegExp('^(https:\\/\\/)');
  return pattern.test(str);
};

const Content = WithAuth((props) => {
  const nav = useDependency<typeof NavigatorRef>(NavigatorToken);
  const navigation = useNavigation<ScreenNavigationProp>();

  const defaultActions = [
    {
      title: '视频监控',
      route: ROUTER_FLAG.StoreSelect,
      image: require('@/src/assets/images/dashboard/video.png'),
    },
  ];

  const actions = useMemo(() => {
    return defaultActions.filter((item) => nav.current?.getRootState().routeNames.includes(item.route));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.permissions]);

  return (
    <View className="mx-3 mt-4">
      <Group
        title="全部功能"
        actions={actions}
        onItemPress={(item) => {
          if (isValidUrl(item.route)) {
            navigation.navigate(ROUTER_FLAG.WebViewScreen, {
              url: item.route,
            });
            return;
          }
          navigation.navigate(item.route as any);
        }}
      />
    </View>
  );
});

/**
 * 当这个页面被聚焦时，重置 tracker
 * 当进入这个页面的时候需要吧视频监控提示相关的状态重置
 */
const useResetTrackerWhenScreenFocused = () => {
  const tracker = useDependency(TrackerStore);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      tracker.reset();
    }
  }, [isFocused, tracker]);
};

export const DashboardScreen = observer(() => {
  const { currentUser } = useDependency(UserStore);

  const navigation = useNavigation<ScreenNavigationProp>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <XStack alignItems="center" space="$2.5" paddingHorizontal="$4.2">
            <Avatar size="$3.5" circular>
              <Avatar.Image src={currentUser!.avatar} />
            </Avatar>
            <Text fontSize={18} fontWeight="600">
              塔塔工作台
            </Text>
          </XStack>
        );
      },
      headerTitle: () => null,
      headerStyle: {
        backgroundColor: '#F7F8FA',
      },
    });
  }, [navigation, currentUser]);

  useResetTrackerWhenScreenFocused();

  return (
    <Container backgroundColor="$pageColor">
      <FocusStatusBar barStyle="dark-content" backgroundColor="white" />
      <View className="mx-3 mt-4">
        {/* <Group
              title="常用功能"
              actions={[
                {
                  title: '视频监控',
                  image: require('@/src/assets/images/video.png'),
                  onClick: () => {
                    navigation.push(ROUTER_FLAG.StoreSelect);
                  },
                },
                {
                  title: 'Map',
                  image: require('@/src/assets/images/video.png'),
                  onClick: () => {
                    navigation.push(ROUTER_FLAG.Map);
                  },
                },
              ]}
            /> */}
      </View>
      <Content url={ROUTER_FLAG.Dashboard} hasData />
    </Container>
  );
});
