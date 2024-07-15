import { FocusStatusBar, Header } from '@/src/components';
import { Right, Setting } from '@/src/icons';
import { useDependency } from '@/src/ioc';
import { NavigatorRef, NavigatorToken, ROUTER_FLAG } from '@/src/navigation';
import { GlobalStore, UserStore } from '@/src/store';
import { observer } from 'mobx-react-lite';
import { StyleSheet } from 'react-native';
import { Avatar, Button, ListItem, Text, XStack, YGroup, YStack } from 'tamagui';

const HeaderAvatar = observer(() => {
  const user = useDependency(UserStore);

  return (
    <XStack justifyContent="space-between" alignItems="center">
      <XStack flex={1} alignItems="center">
        <Avatar circular size="$6">
          <Avatar.Image
            accessibilityLabel="Cam"
            src={user.currentUser?.avatar ?? require('@/src/assets/images/map/avatar.png')}
          />
          <Avatar.Fallback backgroundColor="$primaryLight" />
        </Avatar>
        <YStack flex={1} marginLeft={12}>
          <Text fontSize={16} fontWeight="500" color="$black8Light">
            {user.currentUser?.shUser?.nickName}
          </Text>
        </YStack>
      </XStack>
    </XStack>
  );
});

export const MeScreen = () => {
  const nav = useDependency<typeof NavigatorRef>(NavigatorToken);
  const { logout } = useDependency(GlobalStore);

  return (
    <YStack height="100%" paddingBottom="$3.5" justifyContent="space-between" backgroundColor="white">
      <FocusStatusBar barStyle="dark-content" backgroundColor="white" />
      <YStack>
        <Header top={64} left={12}>
          <HeaderAvatar />
        </Header>
        <YGroup
          marginTop="$-10"
          alignSelf="center"
          size="$4"
          marginHorizontal={12}
          backgroundColor="$white"
          borderRadius={12}
          shadowColor="#FFFFFF"
          shadowOpacity={0.1}
          shadowRadius={12}
          shadowOffset={{ width: 0, height: 4 }}
        >
          <YGroup.Item>
            <ListItem
              paddingLeft={20}
              paddingRight={16}
              paddingVertical={16}
              icon={Setting}
              backgroundColor="$white"
              iconAfter={Right}
              borderBottomWidth={StyleSheet.hairlineWidth}
              borderBottomColor="#F2F3F5"
              onPress={() => nav.current?.navigate(ROUTER_FLAG.Setting)}
            >
              设置
            </ListItem>
          </YGroup.Item>
        </YGroup>
      </YStack>
      <Button
        onPress={logout}
        height="$4.5"
        fontSize={16}
        fontWeight="normal"
        borderRadius="$0"
        marginHorizontal="$3.5"
      >
        退出登录
      </Button>
    </YStack>
  );
};
