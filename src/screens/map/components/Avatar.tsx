import { Check, Close, Down } from '@/src/icons';
import { useState } from 'react';
import { XStack, Avatar, Text, YStack, Sheet, View, SheetProps, YGroup, ListItem, Separator, useTheme } from 'tamagui';
import { Tag } from '.';
import { TouchableOpacity } from 'react-native';
import { useBrandInfo, useMapInfo, useMapList, usePointCount, useSearch, useSearchInfo, useShowConfig } from '../hooks';
import { ROUTER_FLAG, ScreenNavigationProp } from '@/src/navigation';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

export const AvatarContent = ({ onUpdate }: { onUpdate: () => void }) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const navigation = useNavigation<ScreenNavigationProp>();
  const { brandName } = useBrandInfo();
  const {
    mapInfo: { name: mapName },
  } = useMapInfo();

  return (
    <View position="absolute" top={0} left={0} width="100%">
      <LinearGradient colors={['#FFFFFF', 'rgba(255,255,255,0)']} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}>
        <XStack
          alignItems="center"
          justifyContent="space-between"
          margin={12}
          // style={{ position: 'absolute', top: 12, left: 12, right: 12 }}
        >
          <XStack space="$2" alignItems="center">
            <Avatar
              circular
              size={32}
              onPress={() => {
                navigation.navigate(ROUTER_FLAG.Me);
              }}
            >
              <Avatar.Image src={require('@/src/assets/images/map/avatar.png')} />
              <Avatar.Fallback delayMs={600} backgroundColor="$blue10" />
            </Avatar>
            <YStack justifyContent="center" space="$1" onPress={() => setSheetOpen(true)}>
              <Text style={{ fontSize: 16, fontWeight: 500 }}>{brandName}</Text>
              <XStack alignItems="center" space="$1">
                <Text style={{ fontWeight: 400 }} fontSize={12}>
                  {mapName}
                </Text>
                <Down color="#5e5e5e" />
              </XStack>
            </YStack>
          </XStack>
          {/* <Button
          width="$6"
          height={'$2'}
          backgroundColor="$primaryLight"
          color="$white"
          fontSize={12}
          fontWeight="400"
          borderRadius={8}
          padding="$0"
          onPress={() => navigation.navigate(ROUTER_FLAG.SystemSelect)}
        >
          切换入口
        </Button> */}
        </XStack>
        <AvatarSheet open={sheetOpen} onUpdate={onUpdate} onOpenChange={setSheetOpen} />
      </LinearGradient>
    </View>
  );
};

export const AvatarSheet = (props: SheetProps & { onUpdate: () => void }) => {
  const token = useTheme();
  const { mapList } = useMapList();
  const { brandName } = useBrandInfo();
  const { setDetail: setSearchDetail } = useSearch();
  const { config, update: setShowConfig } = useShowConfig();
  const {
    mapInfo: { id: mapId },
    updateMapInfo: update,
  } = useMapInfo();
  const { setShowCount, setCounts }: any = usePointCount();

  const { setCreateUserList, setCreateUserShopList, setSearchFields, setSearchShopFields } = useSearchInfo();

  const clearSearchInfo = () => {
    setCreateUserList([]);
    setCreateUserShopList([]);
    setSearchFields([]);
    setSearchShopFields([]);
    setSearchDetail({
      position: {
        colors: [],
        groupInfo: [],
        creators: [],
        conditions: {},
        positionStatusList: [],
      },
      shopPositionRequest: {
        creators: [],
        colors: [],
        conditions: {},
        area: [],
      },
      poiPositionRequest: {
        area: [],
        poiIdList: [],
      },
    });
    setShowCount({ poi: false, shop: false, position: false });
    setCounts({ mapPositionCount: 0, poiPositionCount: 0, shopPositionCount: 0 });
    if (!config?.isKeep) {
      setShowConfig({
        isShowAdministrative: false,
        isShowName: true,
        isKeep: false,
        mapType: 1,
      });
    }
    props?.onUpdate();
  };
  return (
    <Sheet animation="medium" modal snapPoints={[30]} native {...props}>
      <Sheet.Overlay animation="medium" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Frame flex={1} backgroundColor="#F5F5F5" paddingHorizontal={12} paddingTop={12} paddingBottom={8}>
        <XStack space="$2" justifyContent="space-between" marginBottom={16}>
          <XStack alignItems="center" space="$2">
            <Avatar circular size="$4">
              <Avatar.Image src={require('@/src/assets/images/map/avatar.png')} />
              <Avatar.Fallback delayMs={600} backgroundColor="$blue10" />
            </Avatar>
            <YStack justifyContent="center" space="$1">
              <Text style={{ fontSize: 16, fontWeight: 500 }}>{brandName}</Text>
            </YStack>
          </XStack>
          <TouchableOpacity onPress={() => props.onOpenChange?.(false)}>
            <Close />
          </TouchableOpacity>
        </XStack>
        <Sheet.ScrollView showsVerticalScrollIndicator={false}>
          <YGroup separator={<Separator borderColor="#ffffff" />}>
            {mapList?.map((info: any) => {
              return (
                <TouchableOpacity
                  key={info.id}
                  onPress={() => {
                    props.onOpenChange?.(false);
                    update(info);
                    clearSearchInfo();
                  }}
                >
                  <YGroup.Item key={info?.id}>
                    <ListItem paddingTop="$4" paddingBottom="$4" backgroundColor="#fff">
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontWeight: 400, fontSize: 16, marginRight: 8 }}>{info?.name}</Text>
                        {mapId === info?.id ? <Tag>当前地图</Tag> : null}
                      </View>

                      {mapId === info?.id ? <Check color={token?.primaryLight.val} /> : null}
                    </ListItem>
                  </YGroup.Item>
                </TouchableOpacity>
              );
            })}
          </YGroup>
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
};
