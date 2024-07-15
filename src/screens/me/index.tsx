import { FocusStatusBar, Header } from '@/src/components';
import { File, Right, Setting } from '@/src/icons';
import { ApplicationType } from '@/src/interfaces/role';
import { useDependency } from '@/src/ioc';
import { NavigatorRef, NavigatorToken, ROUTER_FLAG, RouterParams } from '@/src/navigation';
import { GlobalStore, TrackerStore, UserStore } from '@/src/store';
import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Button, ListItem, Text, XStack, YGroup, YStack } from 'tamagui';

type NativeStackScreenProps = StackScreenProps<RouterParams, 'SystemSelect'>;

const HeaderAvatar = observer(() => {
  const user = useDependency(UserStore);
  const global = useDependency(GlobalStore);
  const navigation = useNavigation<NativeStackScreenProps['navigation']>();
  const tracker = useDependency(TrackerStore);

  const areaName = useMemo(() => {
    if (user.currentRole === 'CORP') {
      return user.currentUser?.corpRoleList?.map((item) => item.roleName).join('、') ?? '';
    }
    return user.currentUser?.shopRoleList?.map((item) => item.roleName).join('、') ?? '';
  }, [user.currentRole, user.currentUser?.corpRoleList, user.currentUser?.shopRoleList]);

  return (
    <XStack justifyContent="space-between" alignItems="center">
      <XStack flex={1} alignItems="center">
        <Avatar circular size="$6">
          <Avatar.Image accessibilityLabel="Cam" src={user.currentUser?.avatar} />
          <Avatar.Fallback backgroundColor="$primaryLight" />
        </Avatar>
        <YStack flex={1} marginLeft={12}>
          <Text fontSize={16} fontWeight="500" color="$black8Light">
            {user.currentUser?.shUser?.nickName}
          </Text>
          <Text marginTop={4} fontSize={14} numberOfLines={1} fontWeight="400" color="$black4Light">
            {areaName}
          </Text>
        </YStack>
      </XStack>
      {(global.applicationList.length > 1 || user.roleList.length > 1) && (
        <Button
          width="$6"
          height="$1.5"
          backgroundColor="$primaryLight"
          color="$white"
          fontSize={12}
          fontWeight="400"
          borderRadius={3}
          padding="$0"
          onPress={() => {
            tracker.destroy();
            navigation.navigate(ROUTER_FLAG.SystemSelect);
          }}
        >
          切换入口
        </Button>
      )}
    </XStack>
  );
});

export const MeScreen = () => {
  const nav = useDependency<typeof NavigatorRef>(NavigatorToken);
  const { logout, applicationType } = useDependency(GlobalStore);

  return (
    <YStack height="100%" paddingBottom="$3.5" justifyContent="space-between" backgroundColor="$pageColor">
      <FocusStatusBar barStyle="dark-content" backgroundColor="white" />
      <YStack>
        <Header top={64} left={12}>
          <HeaderAvatar />
        </Header>
        <YGroup
          marginTop="$-8"
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
          {applicationType === ApplicationType.YYT ? (
            <YGroup.Item>
              <ListItem
                paddingLeft={20}
                paddingRight={16}
                paddingVertical={16}
                icon={File}
                backgroundColor="$white"
                iconAfter={Right}
                borderBottomWidth={StyleSheet.hairlineWidth}
                borderBottomColor="#F2F3F5"
                onPress={() => nav.current?.navigate(ROUTER_FLAG.Gallery)}
              >
                图库管理
              </ListItem>
            </YGroup.Item>
          ) : null}

          {/* <YGroup.Item>
            <ListItem
              paddingLeft={20}
              paddingRight={16}
              paddingVertical={16}
              icon={Tissue}
              backgroundColor="$white"
              iconAfter={Right}
              borderBottomWidth={StyleSheet.hairlineWidth}
              borderBottomColor="#F2F3F5"
            >
              我的组织
            </ListItem>
          </YGroup.Item> */}
          {nav.current?.getRootState().routeNames.includes(ROUTER_FLAG.Setting) && (
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
          )}
        </YGroup>
      </YStack>
      <Button
        onPress={logout}
        backgroundColor="$white"
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
