import { MapPlace, MoreDown } from '@/src/icons';
import { ROUTER_FLAG, ScreenNavigationProp } from '@/src/navigation';
import { useNavigation } from '@react-navigation/native';
import { Image, ImageBackground, TouchableOpacity } from 'react-native';
import { ListItem, XStack, YStack, Text, View } from 'tamagui';
import { useLocation, usePosition } from '../hooks';
import { markerLocationBgIcons } from '../constant/constants';

export const SearchResult = ({
  mapSearchResult,
  shopSearchResult,
  loadMore,
  hasMore,
}: {
  hasMore: boolean;
  loadMore: () => void;
  mapSearchResult: any[];
  shopSearchResult: any[];
}) => {
  return (
    <YStack marginHorizontal={12} marginBottom={12} borderRadius={8} alignItems="center" space="$3">
      {shopSearchResult?.length > 0 ? (
        <ShopSearchResult shopSearchResult={shopSearchResult} loadMore={loadMore} hasMore={hasMore} />
      ) : null}

      {mapSearchResult?.length > 0 ? (
        <View className="w-full">
          <MapSearchResult mapSearchResult={mapSearchResult} />
        </View>
      ) : null}
    </YStack>
  );
};

const ShopSearchResult = ({
  shopSearchResult,
  loadMore,
  hasMore,
}: {
  shopSearchResult: any[];
  hasMore: boolean;
  loadMore: () => void;
}) => {
  const { setPositionInfo } = usePosition();
  const { setLocation } = useLocation();
  const navigation = useNavigation<ScreenNavigationProp>();
  return (
    <View width={'100%'} borderRadius={8} backgroundColor={'#FFFFFF'} paddingVertical={12}>
      <Text
        className="text-secondary-paragraph-dark w-full pb-3 px-4"
        style={{ borderBottomWidth: 1, borderColor: '#F0F0F0' }}
      >
        地图内已有标记
      </Text>
      <View className="px-4">
        {shopSearchResult?.map((item) => {
          const bgImgUrl = markerLocationBgIcons[item?.color ?? 1];
          return (
            <View key={item?.id}>
              <TouchableOpacity
                onPress={() => {
                  setPositionInfo(item);
                  setLocation({ latitude: item?.latitude, longitude: item?.longitude });
                  navigation.navigate(ROUTER_FLAG.MapPointDetail, {
                    latitude: item?.latitude,
                    longitude: item?.longitude,
                  });
                }}
              >
                <XStack>
                  <View paddingTop={12}>
                    {bgImgUrl ? (
                      <ImageBackground
                        style={{
                          width: 20,
                          height: 24,
                        }}
                        source={{ uri: bgImgUrl }}
                        resizeMode="cover"
                        className=""
                      >
                        {item?.icon ? (
                          <Image
                            style={{ borderRadius: 3, marginLeft: 2, marginTop: 2 }}
                            width={16}
                            height={16}
                            source={{
                              uri: item?.icon || null,
                            }}
                          />
                        ) : null}
                      </ImageBackground>
                    ) : null}
                  </View>
                  <View
                    className="truncate text-ellipsis overflow-hidden"
                    style={{
                      width: '90%',
                      borderBottomWidth: 1,
                      borderColor: '#F0F0F0',
                      marginLeft: 12,
                      paddingVertical: 10,
                    }}
                  >
                    <Text color="#141414" fontSize={16} marginBottom={4}>
                      {item.name}
                    </Text>
                    <Text color="#858585" className="truncate text-ellipsis overflow-hidden" fontSize={14}>
                      {item.province}
                      {item.city}
                      {item.district}
                      {item.address}
                    </Text>
                  </View>
                </XStack>
              </TouchableOpacity>
            </View>
          );
        })}

        {!shopSearchResult ? (
          <View>
            <View className="w-full items-center">
              <ListItem backgroundColor="white" alignItems="center" textAlign="center" borderRadius={8}>
                <View className="w-full items-center">
                  <XStack space="$1">
                    <Text className="text-secondary-paragraph-dark">本地图内找不到结果</Text>
                  </XStack>
                </View>
              </ListItem>
            </View>
          </View>
        ) : null}

        {hasMore && shopSearchResult?.length !== 0 ? (
          <View>
            <TouchableOpacity
              onPress={() => {
                loadMore();
              }}
            >
              <ListItem backgroundColor="white" alignItems="center" textAlign="center" borderRadius={8}>
                <View className="w-full items-center">
                  <XStack space="$1">
                    <Text className="text-secondary-paragraph-dark">更多结果</Text>
                    <MoreDown />
                  </XStack>
                </View>
              </ListItem>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const MapSearchResult = ({ mapSearchResult }: { mapSearchResult: any[] }) => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const { setLocation, setLocationInfo } = useLocation();
  return (
    <View width={'100%'} borderRadius={8} backgroundColor={'#FFFFFF'} paddingVertical={12} marginBottom="$11">
      <Text
        className="text-secondary-paragraph-dark w-full pb-3 px-4"
        style={{ borderBottomWidth: 1, borderColor: '#F0F0F0' }}
      >
        搜索更多地点
      </Text>
      <View className="px-4">
        {mapSearchResult.map((item) => {
          const types = Array.isArray(item.type) ? item.type : item.type?.split(';');
          const type = types[types.length - 1];
          const subTitle = type ? `${type}·${item.address}` : `${item.address}`;
          return (
            <View key={item.id}>
              <TouchableOpacity
                onPress={() => {
                  const [longitude, latitude] = item.location.split(',');
                  setLocation({ latitude: Number(latitude), longitude: Number(longitude) });
                  setLocationInfo(item);

                  navigation.navigate(ROUTER_FLAG.MapFastMarkerLocation);
                }}
              >
                <XStack>
                  <View paddingTop={14}>
                    <MapPlace width={16} height={16} color="#141414" />
                  </View>
                  <View
                    style={{
                      width: '90%',
                      borderBottomWidth: 1,
                      borderColor: '#F0F0F0',
                      marginLeft: 12,
                      paddingVertical: 10,
                    }}
                  >
                    <Text color="#141414" fontSize={16} marginBottom={4}>
                      {item.name}
                    </Text>
                    <Text color="#858585" fontSize={14}>
                      {subTitle}
                    </Text>
                  </View>
                </XStack>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};
