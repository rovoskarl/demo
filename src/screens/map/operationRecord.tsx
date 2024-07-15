import { ActivityIndicator, Linking, SafeAreaView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Avatar, Separator, Text, XStack, YStack } from 'tamagui';
import { useLocation, useMapInfo, usePosition, usePositionDetail, usePositionRecord, useRenderType } from './hooks';
import { Right } from '@/src/icons';
import { useEffect, useRef } from 'react';
import { ROUTER_FLAG, ScreenNavigationProp } from '@/src/navigation';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from './constant/constants';
import { Media } from './components';

export const MapOperationRecordScreen = () => {
  const { records, loadMore, loading, hasMore } = usePositionRecord();
  const { mapInfo } = useMapInfo();
  const scrollViewRef = useRef<any>();
  const navigation = useNavigation<ScreenNavigationProp>();
  const { setPositionInfo } = usePosition();
  const { detail, getPositionDetail } = usePositionDetail();
  const { setLocation } = useLocation();
  const { update: updateType } = useRenderType();

  useEffect(() => {
    if (detail && detail?.id) {
      setPositionInfo(detail);
      setLocation({ latitude: detail?.latitude, longitude: detail?.longitude });
      navigation.navigate(ROUTER_FLAG.MapPointDetail, { latitude: detail?.latitude, longitude: detail?.longitude });
    }
  }, [detail, navigation, setLocation, setPositionInfo, updateType]);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;

    if (offsetY + scrollViewHeight >= contentHeight - 50 && !loading && hasMore) {
      loadMore();
    }
  };

  return (
    <SafeAreaView>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {records?.map((item) => {
          const ChangeFieldsContent = () => {
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
              <Text fontSize={12}>
                {item?.operationUserName} 将【{item?.fieldName}】由 {beforeContent} 改为 {afterContent}
              </Text>
            ) : null;
          };
          return (
            <YStack key={item.id} margin="$3" space="$2" flex={1}>
              <XStack justifyContent="center">
                <Text color="#5E5E5E" fontSize={12}>
                  {item?.operationTime}
                </Text>
              </XStack>
              <YStack backgroundColor="$white" borderRadius="$3" padding="$3" space="$3">
                <XStack alignItems="center" space="$2">
                  <Avatar circular size="$2">
                    <Avatar.Image src={require('@/src/assets/images/map/avatar.png')} />
                    <Avatar.Fallback delayMs={600} backgroundColor="$blue10" />
                  </Avatar>
                  <YStack justifyContent="center" space="$1">
                    <Text fontSize={12}>{mapInfo?.name}</Text>
                  </YStack>
                </XStack>
                <YStack space="$2">
                  <Text fontSize={16}>
                    {item?.operationType === 1 ? '新增' : null}
                    {item?.operationType === 2 ? '编辑' : null}
                    {item?.operationType === 3 ? '移动' : null}
                    {item?.operationType === 4 ? '删除' : null}标记
                  </Text>
                  <Text fontSize={12}>
                    {item?.operationUserName} {item?.operationType === 1 ? '标记了一个位置 ' : null}
                    {item?.operationType === 2 ? '编辑了一个位置 ' : null}
                    {item?.operationType === 3 ? '移动分组至 ' : null}
                    {item?.operationType === 4 ? '删除了一个位置 ' : null}
                    {item?.positionName}
                  </Text>
                </YStack>
                <ChangeFieldsContent />
                <Separator />
                <TouchableOpacity
                  onPress={() => {
                    getPositionDetail({ id: item?.positionId, type: item?.positionType });
                  }}
                >
                  <XStack justifyContent="space-between">
                    <Text fontSize={12} color="#5E5E5E">
                      查看详情
                    </Text>
                    <Right />
                  </XStack>
                </TouchableOpacity>
              </YStack>
            </YStack>
          );
        })}
        {loading ? <ActivityIndicator size="large" color="#cccccc" /> : null}
        {!hasMore ? (
          <Text textAlign="center" color="#5E5E5E" fontSize={12} margin="$3">
            没有更多了
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};
