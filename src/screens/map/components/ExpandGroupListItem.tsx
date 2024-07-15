import moment from 'moment';
import { TouchableOpacity, Image, ImageBackground } from 'react-native';
import { Checkbox, Text, View } from 'tamagui';
import { difference } from 'lodash-es';
import { Check, Right, Folder, PointNavi } from '@/src/icons';
import { markerLocationBgIcons, markerLocationIconUrls } from '../constant/constants';
import { GroupManage } from '../constant/label';
import { useGroupMapSelection, useLocation, usePosition } from '../hooks';
import { ROUTER_FLAG, ScreenNavigationProp } from '@/src/navigation';
import { useNavigation } from '@react-navigation/native';

export const ExpandGroupListItem = (props: {
  item: Record<string, any>;
  selectMode: boolean;
  naviChange?: (status: boolean) => void;
  checkedChange?: (checked: boolean, item: Record<string, any>) => void;
  handleGroupSelect?: (item: Record<string, any>) => void;
}) => {
  const { item, selectMode, checkedChange, handleGroupSelect } = props;
  const { selectType, groupIndexMap } = useGroupMapSelection();
  const { setLocation } = useLocation();
  const { pointerIds, folderIds } = useGroupMapSelection();
  const { setPositionInfo } = usePosition();
  const bgImgUrl = markerLocationBgIcons[item.color ?? 1];
  const iconUrl = markerLocationIconUrls[item?.color ?? 1];
  const imageUrl = item.icon || null;
  const navigation = useNavigation<ScreenNavigationProp>();
  const isSelectedPointerOrfolder = folderIds?.length || pointerIds?.length;
  let checked = false;
  // 分组
  if (item.folder) {
    const sequence = item.id;
    let groupPointIds = groupIndexMap.filter((element) => element.id === sequence);
    groupPointIds = groupPointIds?.[0]?.index || [];
    // 选择
    if (groupPointIds?.length) {
      const compare = difference(groupPointIds, pointerIds);
      checked = compare.length === 0;
    } else {
      checked = folderIds.includes(item.id);
    }
    // 点位
  } else {
    checked = pointerIds.includes(item.id);
  }
  return (
    <View className="bg-white flex flex-row rounded-lg mb-2.5 px-4 py-3.5" style={{ height: 80 }}>
      <View>
        {item.folder && <Folder width={24} height={28} />}
        {!item.folder &&
          (imageUrl ? (
            <ImageBackground
              style={{
                width: 24,
                height: 29,
              }}
              source={{ uri: bgImgUrl }}
              resizeMode="cover"
              className=""
            >
              <Image
                style={{ borderRadius: 3, marginLeft: 2, marginTop: 2 }}
                width={19.5}
                height={19.5}
                source={{
                  uri: item?.icon || null,
                }}
              />
            </ImageBackground>
          ) : (
            <Image
              className="ml-0.5"
              style={{ borderRadius: 4 }}
              width={22}
              height={30}
              source={{
                uri: iconUrl || null,
              }}
            />
          ))}
      </View>
      <View className="grow pl-4">
        <View className="flex flex-row">
          <View className="grow flex flex-row" style={{ width: '88%' }}>
            <TouchableOpacity
              onPress={() => {
                if (isSelectedPointerOrfolder) {
                  return;
                }
                if (item.folder) {
                  handleGroupSelect?.(item);
                  console.log(item);
                } else {
                  setPositionInfo(item);
                  setLocation({ latitude: item?.latitude, longitude: item?.longitude });
                  navigation.navigate(ROUTER_FLAG.MapPointDetail, {
                    latitude: item?.latitude,
                    longitude: item?.longitude,
                  });
                  // navigation.push(ROUTER_FLAG.Home);
                }
              }}
            >
              <Text
                style={{ maxWidth: item.folder ? 220 : 300 }}
                className="text-base text-black leading-6"
                ellipsizeMode={'tail'}
                numberOfLines={1}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
            {item.folder ? (
              <Text className="text-base leading-6 mx-2" style={{ color: '#858585' }}>
                ({item.positionNum})
              </Text>
            ) : null}
            {item.folder ? (
              <View className="mt-1.5 mr-2">
                <Right />
              </View>
            ) : null}
          </View>
          {/* poi 不允许批量编辑 删除 移动 */}
          {selectMode && selectType === 'list' && item?.positionType === 1 && !item?.groupType ? (
            <View>
              <Checkbox
                id={`selection_${item.id}_${new Date().getTime()}`}
                size="$4"
                value={item.id}
                checked={checked}
                unstyled={checked}
                onCheckedChange={(_checked: boolean) => {
                  checkedChange?.(_checked, item);
                }}
                className="bg-white"
                style={{ width: 18 }}
              >
                <Checkbox.Indicator borderRadius={4} style={{ backgroundColor: '#00BBB4' }}>
                  <Check color="#fff" width="18px" height="18px" />
                </Checkbox.Indicator>
              </Checkbox>
            </View>
          ) : item.folder ? (
            <TouchableOpacity
              onPress={() => {
                handleGroupSelect?.(item);
              }}
            >
              <View>{/* <GroupMore width={24} height={24} /> */}</View>
            </TouchableOpacity>
          ) : (
            <View className="w-6 h-6">
              <TouchableOpacity
                onPress={() => {
                  setLocation({
                    latitude: item.latitude,
                    longitude: item.longitude,
                  });
                  props?.naviChange?.(true);
                }}
              >
                <PointNavi />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View className="flex flex-row">
          {item.folder ? (
            <Text
              className="grow text-xs w-3/5 text-gray-600 mt-2"
              style={{ fontSize: 13, color: '#858585' }}
              ellipsizeMode={'tail'}
              numberOfLines={1}
            >
              {moment(item.createTime).format('YYYY-MM-DD')} {item.userName} {GroupManage.createText}
            </Text>
          ) : (
            <Text
              className="grow text-xs	w-3/5 text-gray-600 mt-2.5"
              style={{ fontSize: 13, color: '#858585' }}
              ellipsizeMode={'tail'}
              numberOfLines={1}
            >
              {item.province} {item.city} {item.district} {item.address}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};
