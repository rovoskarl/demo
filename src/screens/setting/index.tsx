import { StyleSheet } from 'react-native';
import { ListItem, YGroup } from 'tamagui';
import { Container, FocusStatusBar } from '@/src/components';
import { Right } from '@/src/icons';
import { useNavigation } from '@react-navigation/native';
import { ROUTER_FLAG, ScreenNavigationProp } from '@/src/navigation';

export const SettingScreen = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  return (
    <Container backgroundColor="$pageColor">
      <FocusStatusBar backgroundColor="white" barStyle="dark-content" />
      <YGroup flex={1} marginTop="$2.5" borderRadius="$0" size="$4" backgroundColor="$white">
        <YGroup.Item>
          <ListItem
            paddingLeft={20}
            paddingRight={16}
            paddingVertical={16}
            backgroundColor="$white"
            borderBottomWidth={StyleSheet.hairlineWidth}
            borderBottomColor="#F2F3F5"
            iconAfter={Right}
            onPress={() => navigation.navigate(ROUTER_FLAG.Permission)}
          >
            系统权限管理
          </ListItem>
        </YGroup.Item>
        <YGroup.Item>
          <ListItem
            paddingLeft={20}
            paddingRight={16}
            paddingVertical={16}
            backgroundColor="$white"
            borderBottomWidth={StyleSheet.hairlineWidth}
            borderBottomColor="#F2F3F5"
            iconAfter={Right}
            onPress={() => navigation.navigate(ROUTER_FLAG.About)}
          >
            关于
          </ListItem>
        </YGroup.Item>
      </YGroup>
    </Container>
  );
};
