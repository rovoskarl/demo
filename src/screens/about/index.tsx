import { Container } from '@/src/components';
import { useAppUpdate } from '@/src/hooks';
import { Platform, StyleSheet } from 'react-native';
import Config from 'react-native-config';
import { Image, Text, XStack, YGroup, YStack, ListItem } from 'tamagui';

export const AboutScreen = () => {
  const { checkUpdate, updateNode } = useAppUpdate();

  return (
    <Container>
      <YStack marginTop={48} alignSelf="center" alignItems="center" justifyContent="center">
        <Image source={require('@/src/assets/images/logo.png')} />
        <Text fontSize={18} color="$black8Light" fontWeight="500">
          {Config.APP_NAME}
        </Text>
        <XStack
          height={28}
          marginTop="$3.5"
          alignItems="center"
          justifyContent="center"
          backgroundColor="$primary1Light"
          borderRadius={3}
          paddingHorizontal="$2"
        >
          <Text fontSize={12} fontWeight="400" color="$primaryLight">
            版本号：{Platform.OS === 'ios' ? Config.APP_IOS_VERSION : Config.APP_ANDROID_VERSION}
          </Text>
        </XStack>
      </YStack>
      <YGroup flex={1} marginTop="$10" alignSelf="center" size="$4" marginHorizontal={12} backgroundColor="$white">
        <YGroup.Item>
          <ListItem
            paddingLeft={20}
            paddingRight={16}
            paddingVertical={16}
            backgroundColor="$white"
            borderBottomWidth={StyleSheet.hairlineWidth}
            borderBottomColor="#F2F3F5"
            onPress={() => {
              checkUpdate(true);
            }}
          >
            检查新版本
          </ListItem>
        </YGroup.Item>
        {/* <YGroup.Item>
          <ListItem
            paddingLeft={20}
            paddingRight={16}
            paddingVertical={16}
            backgroundColor="$white"
            borderBottomWidth={StyleSheet.hairlineWidth}
            borderBottomColor="#F2F3F5"
            iconAfter={Right}
          >
            更新日志
          </ListItem>
        </YGroup.Item> */}
      </YGroup>
      {updateNode}
    </Container>
  );
};
