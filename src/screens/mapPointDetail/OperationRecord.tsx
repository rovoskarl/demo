import { Text, View } from 'tamagui';
import { Timeline } from './TimeLine';
import { usePosition } from '../map/hooks';
import { useOperationRecord } from './hooks/useService';
import { useMemo, useRef } from 'react';
import { ActivityIndicator, Linking, TouchableWithoutFeedback } from 'react-native';
import { Media } from '../map/components';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../map/constant/constants';
import { ScrollView } from 'react-native-gesture-handler';

export const OperationRecord = () => {
  const scrollViewRef = useRef<any>();

  const { positionInfo: markerDetail } = usePosition();

  const { records, loadMore, loading, hasMore } = useOperationRecord({
    type: markerDetail.positionType === 1 ? 'position' : 'shop',
    id: markerDetail?.id,
  });

  const events = useMemo(() => {
    return records?.map((item: any, index: number) => {
      return {
        id: `${item?.operationTime}-${index}`,
        time: item?.operationTime,
        render: () => {
          let beforeContent: string | Element = `“${item?.beforeVal || '空'}”`;
          let afterContent: string | Element = `“${item?.afterVal || '空'}”`;

          if (item?.fieldType === 2) {
            beforeContent = item?.beforeVal ? <Media url={item?.beforeVal} /> : '“空”';
            afterContent = item?.afterVal ? <Media url={item?.afterVal} /> : '“空”';
          }

          if (item?.fieldType === 3) {
            beforeContent = item?.beforeVal ? (
              <TouchableWithoutFeedback onPress={() => Linking.openURL(item?.beforeVal)}>
                <Text color={'#4ea1db'}>“{item?.beforeVal}”</Text>
              </TouchableWithoutFeedback>
            ) : (
              '“空”'
            );
            afterContent = item?.afterVal ? (
              <TouchableWithoutFeedback onPress={() => Linking.openURL(item?.afterVal)}>
                <Text color={'#4ea1db'}>“{item?.afterVal}”</Text>
              </TouchableWithoutFeedback>
            ) : (
              '“空”'
            );
          }

          if (item?.fieldType === 4) {
            const beforeColors = colors.find(({ key }) => key === +item.beforeVal)?.colors;
            const afterColors = colors.find(({ key }) => key === +item.afterVal)?.colors;
            beforeContent = beforeColors ? (
              <LinearGradient
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 20,
                }}
                colors={beforeColors}
              />
            ) : (
              '“空”'
            );
            afterContent = afterColors ? (
              <LinearGradient
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 20,
                }}
                colors={afterColors}
              />
            ) : (
              '“空”'
            );
          }

          return item.fieldName ? (
            <Text fontSize={14}>
              {item?.operationUserName} 将【{item?.fieldName}】由 {beforeContent} 改为 {afterContent}
            </Text>
          ) : (
            <Text fontSize={14}>
              {item?.operationUserName}{' '}
              {{ 1: '新增', 2: '编辑', 3: '移动分组至', 4: '删除' }[item?.operationType as number]}{' '}
              {markerDetail.positionType === 1 ? item.positionName : '门店'}
            </Text>
          );
        },
      };
    });
  }, [markerDetail.positionType, records]);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;

    if (offsetY + scrollViewHeight >= contentHeight - 50 && !loading && hasMore) {
      loadMore();
    }
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={30}
      showsHorizontalScrollIndicator={false}
    >
      <View padding={12} backgroundColor="$white" borderRadius="$5" marginTop={4}>
        <Timeline events={events} />
      </View>
      {loading ? <ActivityIndicator size="large" color="#cccccc" /> : null}
      {!hasMore ? (
        <Text textAlign="center" color="#5E5E5E" fontSize={12} margin="$3">
          没有更多了
        </Text>
      ) : null}
    </ScrollView>
  );
};
