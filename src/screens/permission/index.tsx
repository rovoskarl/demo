import { YStack, Text } from 'tamagui';
import { Container, FocusStatusBar, ListItem } from '@/src/components';
import { useDependency } from '@/src/ioc';
import { PLATFORM_INCLUDE_PERMISSIONS, PLATFORM_INCLUDE_VALUES, PermissionService } from './service';
import { useQuery } from '@tanstack/react-query';
import { RESULTS } from 'react-native-permissions';

export const PermissionScreen = () => {
  const service = useDependency(PermissionService);

  const { data } = useQuery({
    queryKey: ['permission'],
    queryFn: () => service.permissionValues(PLATFORM_INCLUDE_PERMISSIONS ?? []),
  });

  const { data: notifications } = useQuery({
    queryKey: ['notification_permission'],
    queryFn: () => service.requestNotificationPermission(),
  });

  console.log('🚀 ~ file: index.tsx:20 ~ PermissionScreen ~ notifications:', notifications);

  const { data: statusList } = useQuery({
    queryKey: ['permission_status'],
    queryFn: () => service.checkMultiple((data ?? [])?.map((item) => item.value)),
    enabled: !!data,
  });

  console.log('🚀 ~ file: index.tsx:26 ~ PermissionScreen ~ statusList:', statusList);

  const handleOpenAppSettings = async () => {
    await service.openAppSettings();
  };

  return (
    <Container backgroundColor="$pageColor">
      <FocusStatusBar backgroundColor="white" barStyle="dark-content" />
      <YStack flex={1} marginTop="$2.5" borderRadius="$0" backgroundColor="$white">
        {/* <ListItem
          title="消息通知"
          subTitle={
            notifications?.status !== RESULTS.GRANTED
              ? '前往系统设置开启通知'
              : '若想关闭消息通知，可前往 “设置”＞“通知中心”。'
          }
          iconAfter={
            notifications?.status === RESULTS.GRANTED || notifications?.status === RESULTS.LIMITED ? (
              <Text color="rgba(0,0,0,0.25)" fontSize={16} fontWeight="400">
                已开启
              </Text>
            ) : (
              '去开启'
            )
          }
        /> */}
        {data?.map((item) => (
          <ListItem
            key={item.name}
            title={PLATFORM_INCLUDE_VALUES?.[item.name]}
            iconAfter={
              statusList?.[item.value] === RESULTS.GRANTED || statusList?.[item.value] === RESULTS.LIMITED ? (
                <Text color="rgba(0,0,0,0.25)" fontSize={16} fontWeight="400">
                  已开启
                </Text>
              ) : (
                '去开启'
              )
            }
            onPress={() => {
              handleOpenAppSettings();
            }}
          />
        ))}
        {/* <ListItem title="相册" iconAfter="去授权" onPress={() => service.onCheckPhotoStatus()} /> */}
        {/* <ListItem title="录音" iconAfter="去授权" onPress={() => service.onCheckMicrophoneStatus()} />  */}
      </YStack>
    </Container>
  );
};
