import moment from 'moment';
import { Call, TelephoneService } from './service';
import classNames from 'classnames';
import { useDependency } from '@/src/ioc';
import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Text, View, Platform, NativeModules, TouchableOpacity } from 'react-native';
import { useLayoutEffect, useMemo } from 'react';
import { Loading } from '@/src/components';
import { useSocket } from './hooks/useSocket';
import { Dialog } from './components/Dialog';
import { useNavigation } from '@react-navigation/native';
import { GlobalStore } from '@/src/store';
import { ROUTER_FLAG, RouterParams } from '@/src/navigation';
import { StackScreenProps } from '@react-navigation/stack';
import { Button } from 'tamagui';

/**
 * 1、获取直接拨打电话、通话记录权限
 * 2、获取可以访问所有文件的权限
 * 3、判断是否有权限，无权限则不拨打电话
 * 4、有权限拨打电话
 * 5、后台执行上传录音文件
 * @returns
 */

const { TelephoneModule } = NativeModules;

type NativeStackScreenProps = StackScreenProps<RouterParams, 'SystemSelect'>;

const days: { [key: number]: string } = {
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '日',
};

function formatDate(timestamp: string) {
  var now = moment();
  var date = moment(timestamp);
  var delta = now.diff(date, 'days');
  if (delta === 0) {
    return date.format('HH:mm');
  } else if (delta === 1) {
    return '昨天';
  } else if (delta < 7) {
    const d = date.format('d');
    return `星期${days[Number(d)]}`; // 格式化为星期几
  } else {
    return date.format('YYYY-MM-DD');
  }
}

function formatSeconds(seconds: number) {
  // 计算小时、分钟和秒
  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor((seconds % 3600) / 60);
  var remainingSeconds = seconds % 60;

  // 格式化为时分秒格式的字符串
  var formattedTime = '';
  if (hours > 0) {
    formattedTime += hours + '时';
  }
  if (minutes > 0 || hours > 0) {
    formattedTime += minutes + '分';
  }
  formattedTime += remainingSeconds + '秒';

  return formattedTime;
}

export function TelephoneScreen() {
  const global = useDependency(GlobalStore);
  const service = useDependency(TelephoneService);
  const navigation = useNavigation<NativeStackScreenProps['navigation']>();

  const { data, isFetching, hasNextPage, fetchNextPage, isLoading, refetch } = useInfiniteQuery({
    queryKey: ['call_list'],
    queryFn: async ({ pageParam = 1 }: { pageParam: number }) => {
      return await service.fetchCallList({ pageNum: pageParam, pageSize: 20 });
    },
    initialPageParam: 1,
    getNextPageParam: (_lastPage, pages) => {
      const hasNext = 20 * pages.length < _lastPage.total;
      if (hasNext) {
        return pages.length + 1;
      }
      return undefined;
    },
  });

  const { show, setShow, onCallPhone } = useSocket(refetch);

  const calls = useMemo(() => {
    return data?.pages.flatMap((item) => item.result);
  }, [data]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
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
            if (global.applicationList.length > 1) {
              navigation.navigate(ROUTER_FLAG.SystemSelect);
              return;
            }
            global.logout();
          }}
        >
          {global.applicationList.length > 1 ? '切换入口' : '退出'}
        </Button>
      ),
    });
  }, [global, navigation]);

  if (isLoading) {
    return <Loading />;
  }

  const PhoneItem = ({ item }: { item: Call }) => {
    return (
      <TouchableOpacity onPress={() => onCallPhone(item.callPhone)}>
        <View className="flex-row items-center justify-between pr-4 pl-3 pt-4 pb-[7]">
          <View className="flex-row">
            <View className="w-10 h-10 rounded-full justify-center items-center bg-gray-200">
              <Text>{item?.receiverName[0]}</Text>
            </View>
            <View className="ml-3">
              <Text
                className={classNames('text-[#141414] text-base font-medium', {
                  ['text-[#F53F3F]']: ['CALL_BACK_BLOCK_CALL', 'BLOCK_CALL'].includes(item.operationType),
                })}
              >
                {item?.receiverName}_{item?.callPhone}
              </Text>
              <Text
                className={classNames('text-[#858585] text-xs font-normal mt-1', {
                  ['text-[#F53F3F]']: ['CALL_BACK_BLOCK_CALL', 'BLOCK_CALL'].includes(item.operationType),
                })}
              >
                {
                  {
                    BLOCK_CALL: '未接通',
                    CALL_BACK_BLOCK_CALL: '未接通',
                    CALL_RECORDING_LOST: `呼出${formatSeconds(item.callDuration)}`,
                    CALL_RECORDING_RETRIEVED: `呼出${formatSeconds(item.callDuration)}`,
                    CALL_BACK_CALL_RECORDING_LOST: `拨入${formatSeconds(item.callDuration)}`,
                    CALL_BACK_CALL_RECORDING_RETRIEVED: `拨入${formatSeconds(item.callDuration)}`,
                  }[item.operationType]
                }
              </Text>
            </View>
          </View>
          <Text className="text-[#858585] text-xs font-normal">{formatDate(item.callTime)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <FlashList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={Platform.OS === 'android'}
        onEndReachedThreshold={0.3}
        data={calls}
        estimatedItemSize={80}
        renderItem={PhoneItem}
        onEndReached={async () => {
          try {
            if (!isFetching && hasNextPage) {
              await fetchNextPage();
            }
          } catch (e) {
            console.log('下一页', e);
          }
        }}
        ListFooterComponent={() => {
          if (isFetching) {
            return (
              <View className="items-center justify-center py-2">
                <Text>加载中～</Text>
              </View>
            );
          }
          if (!hasNextPage) {
            return (
              <View className="items-center justify-center py-2">
                <Text>没有更多通话记录～</Text>
              </View>
            );
          }
          return calls && !calls.length ? (
            <View className="items-center justify-center py-2">
              <Text>暂无内容</Text>
            </View>
          ) : null;
        }}
      />
      <Dialog
        show={show}
        onCancel={() => setShow(false)}
        onOk={() => {
          TelephoneModule.openSettings();
        }}
      />
    </View>
  );
}
