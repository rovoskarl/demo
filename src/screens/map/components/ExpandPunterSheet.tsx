import { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image, TextInput, ImageBackground } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {
  Button,
  Input,
  ListItem,
  Separator,
  Sheet,
  SheetProps,
  XStack,
  YGroup,
  YStack,
  Text as TText,
  RadioGroup,
} from 'tamagui';
import {
  useAddGroup,
  useGroupList,
  useMarkerLocation,
  useUpload,
  useBatchExpand,
  useGroupMapSelection,
  useGaodeNavigation,
} from '../hooks';
import { PlusCircle, Check, Close, PlusFolder, Right, Search } from '@/src/icons';
import { Breadcrumb, WithAuth } from '@/src/components';
import { Colors } from './Colors';
import { Toast, ToastToken } from '@/src/interfaces/notifications';
import { useDependency } from '@/src/ioc';
import { IconSheet } from '.';
import { ButtonPermission, markerLocationBgIcons } from '../constant/constants';

export const MarkerImportStyleInfoSheet = ({
  onClose,
  forwardPunterGroup,
}: {
  onClose: () => void;
  forwardPunterGroup: () => void;
}) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetIconOpen, setSheetIconOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [images, setImages] = useState<string[]>([]);
  const { markerLocationDetail, setMarkerLocationDetail } = useMarkerLocation();
  const { iconInfo } = markerLocationDetail;
  const { color, setColor, setIcon } = useBatchExpand();
  const bgImgUrl = markerLocationBgIcons[color?.[0] || 1];
  const onChooseChange = useCallback(
    (res: string[]) => {
      setImages((img) => {
        setMarkerLocationDetail({ ...markerLocationDetail, imageInfo: [...img, ...res] });
        return [...img, ...res];
      });
    },
    [markerLocationDetail, setMarkerLocationDetail],
  );
  useEffect(() => {
    setMarkerLocationDetail({});
  }, [setMarkerLocationDetail]);
  return (
    <View style={{ flex: 1, height: 240 }} className="absolute bottom-0 w-full rounded-lg">
      <View className="absolute w-full bottom-0 px-3 pt-3 pb-2 bg-bgColor rounded-t-xl">
        <View style={{ marginBottom: 66 }} className="px-1">
          <XStack justifyContent="space-between" marginBottom={16} paddingHorizontal={10} alignItems="center">
            <Text className="text-xl text-blank text-medium">选择导入后样式</Text>
            <TouchableOpacity onPress={onClose}>
              <Close />
            </TouchableOpacity>
          </XStack>

          <YGroup separator={<Separator borderColor="#F0F0F0" />}>
            <YGroup.Item>
              <ListItem backgroundColor="$white">
                <XStack alignItems="center" justifyContent="space-between" space="$2" flex={1}>
                  <Text>图标颜色</Text>
                  <Colors isSingle value={color} onChange={(newKey: any[]) => setColor(newKey)} />
                </XStack>
              </ListItem>
            </YGroup.Item>
            <YGroup.Item>
              <ListItem backgroundColor="$white">
                <XStack alignItems="center" justifyContent="space-between" space="$2" flex={1}>
                  <XStack>
                    <Text>图标填充图片</Text>
                  </XStack>
                  <TouchableOpacity onPress={() => setSheetIconOpen(true)}>
                    <XStack alignItems="center" justifyContent="flex-end" space="$2">
                      {iconInfo?.[0]?.url ? (
                        <ImageBackground
                          style={{
                            width: 40,
                            height: 48,
                          }}
                          source={{ uri: bgImgUrl }}
                          resizeMode="cover"
                          className=""
                        >
                          <Image
                            style={{ marginLeft: 5, marginTop: 5 }}
                            source={{
                              uri: iconInfo?.[0]?.url,
                              width: 30,
                              height: 30,
                            }}

                            // style={{ borderWidth: 3, borderColor: '#7F93F8', borderRadius: 8 }}
                          />
                        </ImageBackground>
                      ) : (
                        <Text
                          className="text-right text-secondary-paragraph-dark"
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          选择填充
                        </Text>
                      )}

                      <Right color="#858585" />
                    </XStack>
                  </TouchableOpacity>
                </XStack>
              </ListItem>
            </YGroup.Item>
          </YGroup>
        </View>
        <YStack>
          <Button
            backgroundColor="#00BBB4"
            color="white"
            onPress={() => {
              setIcon(iconInfo && iconInfo.length ? iconInfo[0]?.url : '');
              forwardPunterGroup();
            }}
          >
            下一步
          </Button>
        </YStack>
      </View>
      {sheetOpen ? (
        <ChoosePhotoCameraSheet onChange={onChooseChange} type={1} open={sheetOpen} onOpenChange={setSheetOpen} />
      ) : null}
      {sheetIconOpen ? (
        <IconSheet
          value={iconInfo}
          onChange={(v) => {
            setMarkerLocationDetail({ ...markerLocationDetail, iconInfo: v });
          }}
          open={sheetIconOpen}
          onOpenChange={setSheetIconOpen}
        />
      ) : null}
    </View>
  );
};

/**
 * @component       ChoosePhotoCameraSheet
 * @description     添加图片
 * @param props
 * @returns
 */
const ChoosePhotoCameraSheet = (props: SheetProps & { type: 1 | 2; onChange?: (res: string[]) => void }) => {
  const { upload } = useUpload();
  const onCamera = () => {
    launchCamera({ mediaType: 'photo' }, ({ assets }) => {
      if (assets) {
        upload({ type: props?.type, files: assets }).then((res: any) => {
          props.onOpenChange?.(false);
          props?.onChange?.(res);
        });
      }
    });
  };
  const onLibrary = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 9 }, ({ assets }) => {
      if (assets) {
        console.log(assets);
        upload({ type: props?.type, files: assets }).then((res: any) => {
          props.onOpenChange?.(false);
          props?.onChange?.(res);
        });
      }
    });
  };
  return (
    <Sheet animation="medium" modal snapPoints={[23]} native {...props} dismissOnOverlayPress={false}>
      <Sheet.Overlay animation="medium" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Frame flex={1} backgroundColor="#F5F5F5">
        <Sheet.ScrollView>
          <YStack space="$2">
            <YGroup>
              <YGroup.Item>
                <TouchableOpacity>
                  <ListItem
                    onPress={onCamera}
                    paddingTop="$4"
                    paddingBottom="$4"
                    backgroundColor="#fff"
                    justifyContent="center"
                  >
                    <Text>拍照</Text>
                  </ListItem>
                </TouchableOpacity>
              </YGroup.Item>
              <YGroup.Item>
                <TouchableOpacity>
                  <ListItem
                    onPress={onLibrary}
                    paddingTop="$4"
                    paddingBottom="$4"
                    backgroundColor="#fff"
                    justifyContent="center"
                  >
                    <Text>相册</Text>
                  </ListItem>
                </TouchableOpacity>
              </YGroup.Item>
              <TouchableOpacity onPress={() => props.onOpenChange?.(false)}>
                <ListItem marginTop="$4" paddingBottom="$4" backgroundColor="#fff" justifyContent="center">
                  <Text>取消</Text>
                </ListItem>
              </TouchableOpacity>
            </YGroup>
          </YStack>
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
};

/**
 * @component       PunterGroupSheet
 * @description     选择分组
 * @param props
 * @returns
 */
export const PunterGroupSheet = WithAuth((props: any) => {
  const {
    open,
    cancelText = '',
    handleText = '确定',
    header = '导入到当前地图',
    onOpenChange,
    cancelAction,
    handlerAction,
    permissions,
  } = props;
  const hasCreateGroup = permissions?.find((item: any) => item.url === ButtonPermission.CreateGroup);

  const [createGroupSheetOpen, setCreateGroupSheetOpen] = useState(false);
  const { list, getGroupList } = useGroupList();
  const [groupId, setGroupId] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string | null; name: string }[]>([{ id: null, name: '列表' }]);
  const { addGroup: addGroupService } = useAddGroup();
  const [inputValue, setInputValue] = useState('');
  const { markerLocationDetail, setMarkerLocationDetail } = useMarkerLocation();
  const { groupInfo } = markerLocationDetail;
  const { updateAttribute } = useBatchExpand();
  const _list = list?.filter((item: any) => item?.managePrivilege || item?.addPrivilege);
  const addGroup = useCallback(
    ({ name }: { name: string }) => {
      addGroupService({ name, parentId: groupId }).then(() => {
        setCreateGroupSheetOpen(false);
        getGroupList({ groupName: inputValue, parentId: groupId });
      });
    },
    [addGroupService, getGroupList, groupId, inputValue],
  );
  const toast = useDependency<Toast>(ToastToken);
  useEffect(() => {
    setMarkerLocationDetail({ ...markerLocationDetail, groupInfo: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMarkerLocationDetail]);
  return (
    <Sheet animation="medium" modal snapPoints={[70]} native open={open} dismissOnOverlayPress={false}>
      <Sheet.Overlay animation="medium" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Frame flex={1}>
        <XStack paddingTop={12} paddingHorizontal={24} justifyContent="space-between" alignItems="center">
          <Text style={{ fontSize: 20, fontWeight: '500', color: '#333' }}>{header}</Text>
          <TouchableOpacity
            onPress={() => {
              onOpenChange?.(false);
              setMarkerLocationDetail({ ...markerLocationDetail, groupInfo: null });
            }}
          >
            <Close />
          </TouchableOpacity>
        </XStack>
        <Sheet.ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
          <YStack padding={12} space="$3" backgroundColor="#F5F5F5">
            <XStack backgroundColor="$white" borderRadius={8} alignItems="center" paddingLeft="$3">
              <Search width={16} height={16} />
              <Input
                borderWidth={0}
                value={inputValue}
                flex={1}
                placeholder="搜索"
                backgroundColor="$white"
                height={40}
                onChangeText={(text) => {
                  setInputValue(text);
                  getGroupList({ groupName: text, parentId: groupId });
                }}
              />
            </XStack>
            <Breadcrumb className="bg-transparent p-0">
              {breadcrumbs.map(({ name, id }) => (
                <Breadcrumb.Item
                  onPress={() => {
                    const index = breadcrumbs.findIndex((item) => item.id === id);
                    setBreadcrumbs((prev) => prev.slice(0, index + 1));
                    getGroupList({ parentId: id as string });
                    updateAttribute({ groupId: id, groupName: name });
                    setGroupId(id);
                  }}
                  key={`${name}-${id}`}
                >
                  {name}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>

            {hasCreateGroup ? (
              <XStack backgroundColor="$white" padding="$3" space="$3" borderRadius="$3" alignItems="center">
                <TouchableOpacity
                  onPress={() => {
                    setCreateGroupSheetOpen(true);
                  }}
                >
                  <View className="rounded-lg w-12 h-12 flex items-center justify-center">
                    <PlusCircle />
                  </View>
                </TouchableOpacity>
                <YStack space="$1">
                  <TText color="#00BBB4">点击创建新分组</TText>
                </YStack>
              </XStack>
            ) : null}

            {_list.length > 0 ? (
              <RadioGroup
                name="form"
                value={groupInfo?.id}
                onValueChange={(res) => {
                  const group: any = _list.find((item: any) => item.id === res);
                  if (group?.id) {
                    updateAttribute({ groupId: group.id, groupName: group?.name });
                    setGroupId(group.id);
                  }
                  setMarkerLocationDetail({ ...markerLocationDetail, groupInfo: group });
                }}
              >
                <YStack space="$3">
                  {_list.map((group: any) => {
                    return (
                      <ListItem
                        key={group?.id}
                        icon={<PlusFolder />}
                        padding="$3"
                        backgroundColor="#fff"
                        className="rounded-lg"
                        onPress={() => {
                          // updateAttribute({ groupId: group?.id, groupName: group?.name });
                          // setGroupId(group?.id);
                          getGroupList({ parentId: group?.id });
                          setBreadcrumbs((prev) => [...prev, { id: group?.id, name: group?.name }]);
                        }}
                      >
                        <XStack flex={1} justifyContent="space-between" alignItems="center">
                          <XStack alignItems="center" space="$2">
                            <Text
                              style={{ maxWidth: 200 }}
                              className="text-base leading-8"
                              ellipsizeMode={'tail'}
                              numberOfLines={1}
                            >
                              {group?.name}
                            </Text>
                            <Text className="text-secondary-paragraph-dark">（{group?.positionNum}）</Text>
                            <Right />
                          </XStack>

                          <RadioGroup.Item value={group.id} backgroundColor="$white">
                            <RadioGroup.Indicator className="w-full h-full bg-primary items-center justify-center">
                              <Check color="#fff" width="16" height="16" />
                            </RadioGroup.Indicator>
                          </RadioGroup.Item>
                        </XStack>
                      </ListItem>
                    );
                  })}
                </YStack>
              </RadioGroup>
            ) : (
              <View className="flex-1  items-center justify-center">
                <Text>暂无信息</Text>
              </View>
            )}
          </YStack>
        </Sheet.ScrollView>
        <XStack
          space
          justifyContent="center"
          backgroundColor="$white"
          bottom={0}
          style={{ paddingBottom: 30, paddingLeft: 12, paddingRight: 12, paddingTop: 8 }}
        >
          {cancelText ? (
            <Button
              style={{ width: '48%', fontSize: 40 }}
              onPress={() => {
                cancelAction();
              }}
            >
              {cancelText}
            </Button>
          ) : null}
          <Button
            style={{ width: cancelText ? '48%' : '98%', fontSize: 18 }}
            backgroundColor="#00BBB4"
            color="white"
            fontWeight="500"
            onPress={() => {
              if (!groupId) {
                toast.show('请选择分组');
                return;
              }
              handlerAction(groupId);
              onOpenChange?.(false);
            }}
          >
            {handleText}
          </Button>
        </XStack>
        {createGroupSheetOpen ? (
          <CreatePunterGroupSheet
            open={createGroupSheetOpen}
            onOpenChange={setCreateGroupSheetOpen}
            addGroup={addGroup}
          />
        ) : null}
      </Sheet.Frame>
    </Sheet>
  );
});

/**
 * @component         CreatePunterGroupSheet
 * @description       创建分组
 * @param props
 * @returns
 */
export const CreatePunterGroupSheet = (props: SheetProps & { addGroup: (data: { name: string }) => void }) => {
  const [inputValue, setInputValue] = useState('');
  return (
    <Sheet animation="medium" modal snapPoints={[60]} native {...props} dismissOnOverlayPress={false}>
      <Sheet.Overlay animation="medium" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Frame flex={1}>
        <Sheet.ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
          <YStack borderRadius="$2" padding="$4" backgroundColor="#F5F5F5">
            <XStack space="$2" justifyContent="space-between" marginBottom={24}>
              <TouchableOpacity onPress={() => props.onOpenChange?.(false)}>
                <Text style={{ color: '#5E5E5E' }} className="text-base">
                  取消
                </Text>
              </TouchableOpacity>
              <Text className="text-black text-base">创建新分组</Text>
              <TouchableOpacity onPress={() => props.addGroup?.({ name: inputValue })}>
                <Text className="text-primary text-base">完成</Text>
              </TouchableOpacity>
            </XStack>
            <Input
              autoFocus={true}
              value={inputValue}
              placeholder="分组名称"
              onChangeText={setInputValue}
              fontSize={16}
              style={{ backgroundColor: '#fff', height: 48, borderRadius: 8, padding: 12 }}
            />
          </YStack>
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
};

/**
 * @method        ChooseNaviSheet
 * @param props
 * @returns
 */
export const ChooseNaviSheet = (props: SheetProps) => {
  const { openGaodeMap, openBaiduMap } = useGaodeNavigation();
  return (
    <Sheet dismissOnOverlayPress={false} animation="medium" modal snapPoints={[25]} native {...props}>
      <Sheet.Overlay animation="medium" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Frame flex={1} backgroundColor="#F5F5F5">
        <Sheet.ScrollView>
          <YStack space="$2">
            <YGroup>
              <YGroup.Item>
                <TouchableOpacity
                  onPress={() => {
                    openGaodeMap();
                  }}
                >
                  <ListItem justifyContent="center" paddingTop="$4" paddingBottom="$4" backgroundColor="#fff">
                    <Text>高德地图</Text>
                  </ListItem>
                </TouchableOpacity>
              </YGroup.Item>
              <YGroup.Item>
                <TouchableOpacity
                  onPress={() => {
                    openBaiduMap();
                  }}
                >
                  <ListItem justifyContent="center" paddingTop="$4" paddingBottom="$4" backgroundColor="#fff">
                    <Text>百度地图</Text>
                  </ListItem>
                </TouchableOpacity>
              </YGroup.Item>
              <TouchableOpacity onPress={() => props.onOpenChange?.(false)}>
                <ListItem marginTop="$4" paddingBottom="$4" backgroundColor="#fff" justifyContent="center">
                  <Text>取消</Text>
                </ListItem>
              </TouchableOpacity>
            </YGroup>
          </YStack>
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
};
/**
 * @component       ChooseGroupMapSheet
 * @description     选择列表或地图
 * @param props
 * @returns
 */
export const ChooseGroupMapSheet = (
  props: SheetProps & { forwardMapSelection: Function; hasChooseList: boolean; hasChooseMap: boolean },
) => {
  const { setSelectType, setSelectMode } = useGroupMapSelection();
  return (
    <Sheet animation="medium" modal snapPoints={[27]} native {...props} dismissOnOverlayPress={false}>
      <Sheet.Overlay animation="medium" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Frame flex={1} backgroundColor="#F5F5F5">
        <Sheet.ScrollView>
          <YStack space="$2">
            <YGroup>
              {props?.hasChooseList ? (
                <YGroup.Item>
                  <TouchableOpacity>
                    <ListItem
                      onPress={() => {
                        setSelectType('list');
                        setSelectMode(true);
                        props.onOpenChange?.(false);
                      }}
                      paddingTop="$5"
                      paddingBottom="$4"
                      backgroundColor="#fff"
                      justifyContent="center"
                    >
                      <TText fontSize={16} color="#141414">
                        从列表选择
                      </TText>
                    </ListItem>
                  </TouchableOpacity>
                </YGroup.Item>
              ) : null}

              {props?.hasChooseMap ? (
                <YGroup.Item>
                  <TouchableOpacity>
                    <ListItem
                      onPress={() => {
                        setSelectMode(false);
                        props.onOpenChange?.(false);
                        props.forwardMapSelection?.();
                      }}
                      paddingTop="$4"
                      paddingBottom="$5"
                      backgroundColor="#fff"
                      justifyContent="center"
                    >
                      <TText fontSize={16} color="#141414">
                        从地图选择
                      </TText>
                    </ListItem>
                  </TouchableOpacity>
                </YGroup.Item>
              ) : null}

              <TouchableOpacity onPress={() => props.onOpenChange?.(false)}>
                <ListItem
                  marginTop="$3"
                  paddingTop="$5"
                  paddingBottom="$8"
                  backgroundColor="#fff"
                  justifyContent="center"
                >
                  <TText fontSize={16} color="#141414">
                    取消
                  </TText>
                </ListItem>
              </TouchableOpacity>
            </YGroup>
          </YStack>
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
};

/**
 * @method         BatchEditPointSheet
 * @param          批量编辑
 * @returns
 */
export const BatchEditPointSheet = ({
  onClose,
  batchUpdatePoint,
}: {
  onClose: () => void;
  batchUpdatePoint: () => void;
}) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetIconOpen, setSheetIconOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [images, setImages] = useState<string[]>([]);
  const { markerLocationDetail, setMarkerLocationDetail } = useMarkerLocation();
  const { iconInfo } = markerLocationDetail;
  const { color, description, setColor, setIcon, setDescription } = useGroupMapSelection();
  const bgImgUrl = markerLocationBgIcons[color?.[0] || 1];
  const onChooseChange = useCallback(
    (res: string[]) => {
      setImages((img) => {
        setMarkerLocationDetail({ ...markerLocationDetail, imageInfo: [...img, ...res] });
        return [...img, ...res];
      });
    },
    [markerLocationDetail, setMarkerLocationDetail],
  );
  // 批量编辑默认颜色为空
  useEffect(() => {
    setColor([]);
  }, [setColor]);
  return (
    <View style={{ flex: 1, height: 380 }} className="absolute bottom-0 w-full rounded-lg">
      <YStack
        className="bg-bgColor"
        style={{
          paddingTop: 12,
          paddingLeft: 12,
          paddingRight: 12,
          paddingBottom: 12,
        }}
      >
        <XStack justifyContent="space-between" style={{ marginTop: -8 }} className="rounded-lg">
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>批量编辑</Text>
          <TouchableOpacity onPress={onClose}>
            <Close width={24} height={24} />
          </TouchableOpacity>
        </XStack>

        <YGroup separator={<Separator borderColor="#F0F0F0" />} style={{ marginTop: 8, marginBottom: 12 }}>
          <YGroup.Item>
            <ListItem backgroundColor="$white">
              <XStack alignItems="center" justifyContent="space-between" space="$2" flex={1}>
                <Text style={{ color: '#333', fontSize: 15 }}>图标颜色</Text>
                <Colors isSingle value={color} onChange={(newKey: any[]) => setColor(newKey)} />
              </XStack>
            </ListItem>
          </YGroup.Item>
          <YGroup.Item>
            <ListItem backgroundColor="$white">
              <XStack alignItems="center" justifyContent="space-between" space="$2" flex={1}>
                <XStack>
                  <Text style={{ color: '#333', fontSize: 15 }}>图标填充图片</Text>
                </XStack>
                <TouchableOpacity onPress={() => setSheetIconOpen(true)}>
                  <XStack alignItems="center" justifyContent="flex-end" space="$2">
                    {iconInfo?.[0]?.url ? (
                      <ImageBackground
                        style={{
                          width: 40,
                          height: 48,
                        }}
                        source={{ uri: bgImgUrl }}
                        resizeMode="cover"
                        className=""
                      >
                        <Image
                          style={{ marginLeft: 5, marginTop: 5 }}
                          source={{
                            uri: iconInfo?.[0]?.url,
                            width: 30,
                            height: 30,
                          }}

                          // style={{ borderWidth: 3, borderColor: '#7F93F8', borderRadius: 8 }}
                        />
                      </ImageBackground>
                    ) : (
                      <Text className="text-right text-secondary-paragraph-dark" numberOfLines={1} ellipsizeMode="tail">
                        选择填充
                      </Text>
                    )}
                    <Right color="#858585" />
                  </XStack>
                </TouchableOpacity>
              </XStack>
            </ListItem>
          </YGroup.Item>
        </YGroup>
        <YGroup space="$2">
          <YGroup.Item>
            <ListItem backgroundColor="$white">
              <XStack alignItems="center" justifyContent="space-between" space="$2" flex={1}>
                <Text className="font-bold" style={{ color: '#333', fontSize: 15 }}>
                  业务信息
                </Text>
              </XStack>
            </ListItem>
          </YGroup.Item>
          <View style={{ borderBottomColor: '#eee', borderBottomWidth: 1 }} />
          <YGroup.Item>
            <ListItem backgroundColor="$white">
              <XStack className="flex flex-row" alignItems="center" space="$2" flex={1}>
                <Text style={{ color: '#333', marginTop: -28, top: 0, fontSize: 15 }}>描述</Text>
                <TextInput
                  className="border-0 grow bg-white p-0 rounded-none h-12 ml-5"
                  value={description}
                  onChangeText={(text: string) => {
                    setDescription(text);
                  }}
                  placeholder="批量修改内容后，将覆盖原有内容"
                  multiline={true}
                  textAlignVertical="top"
                />
              </XStack>
            </ListItem>
          </YGroup.Item>
        </YGroup>
      </YStack>
      <YStack
        backgroundColor="$white"
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        style={{
          paddingTop: 12,
          paddingLeft: 18,
          paddingRight: 18,
          paddingBottom: 18,
        }}
      >
        <Button
          backgroundColor="#00BBB4"
          color="white"
          style={{
            borderRadius: 4,
            backgroundColor: '#00BBB4',
            color: 'white',
            padding: 10,
            alignItems: 'center',
            fontSize: 16,
          }}
          unstyled={true}
          onPress={() => {
            setIcon(iconInfo && iconInfo.length ? iconInfo[0]?.url : '');
            batchUpdatePoint();
            setMarkerLocationDetail({});
          }}
        >
          保存
        </Button>
      </YStack>
      {sheetOpen ? (
        <ChoosePhotoCameraSheet onChange={onChooseChange} type={1} open={sheetOpen} onOpenChange={setSheetOpen} />
      ) : null}
      {sheetIconOpen ? (
        <IconSheet
          value={iconInfo}
          onChange={(v) => {
            setMarkerLocationDetail({ ...markerLocationDetail, iconInfo: v });
          }}
          open={sheetIconOpen}
          onOpenChange={setSheetIconOpen}
        />
      ) : null}
    </View>
  );
};
