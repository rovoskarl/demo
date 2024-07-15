import { Button, Text, View } from 'tamagui';
import { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { XStack, YStack, Checkbox } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { ROUTER_FLAG, ScreenNavigationProp } from '@/src/navigation';
import { useDependency } from '@/src/ioc';
import { Toast, ToastToken } from '@/src/interfaces/notifications';
import { PunterGroupSheet } from '@/screens/map/components/ExpandPunterSheet';
import { Close, BatchMove, BatchDelete, BatchEdit, UpOutlined, Check } from '@/src/icons';
import { ExpandGroupViewToast } from './ExpandGroupViewToast';
import { ExpandGroupListItem } from './ExpandGroupListItem';
import { useGroupMapSelection, useBatchUpdatePoint, useLocation, usePointerGroupList } from '../hooks';
import { BatchOperation } from '../constant/label';
import { WithAuth } from '@/src/components';
import { ButtonPermission } from '../constant/constants';

export const ExpandGroupBatchOperation = WithAuth((props: any) => {
  const { handleModal, page = 'list', permissions } = props;
  const hasMove = permissions?.find((item: any) => item.url === ButtonPermission.Move);
  const hasDelete = permissions?.find((item: any) => item.url === ButtonPermission.Delete);
  const hasEdit = permissions?.find((item: any) => item.url === ButtonPermission.Edit);
  const navigation = useNavigation<ScreenNavigationProp>();
  const [pointerShow, setPointerShow] = useState<boolean>(false);
  const [deleteShow, setDeleteShow] = useState<boolean>(false);
  const [deleteFolder, setDeleteFolder] = useState<boolean>(false);
  const toast = useDependency<Toast>(ToastToken);
  const [moveDisabledColor, setMoveDisabledColor] = useState('#333');
  const [deleteDisabledColor, setDeleteDisabledColor] = useState('#333');
  const [sheetGroupOpen, setSheetGroupOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [disabledColor, setDisabledColor] = useState('#333');
  const { folderIds, pointerIds, pointerList, setSelectMode, setFolderIds, setPointerList, setPointerIds } =
    useGroupMapSelection();
  const { handleMove, handleDelete } = useBatchUpdatePoint();
  const { onChangeCurPositionerList } = usePointerGroupList();
  const { setLocation } = useLocation();

  const validAction = () => {
    if (folderIds.length === 0 && pointerIds.length === 0) {
      toast.show(BatchOperation.emptyTip);
      return false;
    }
    return true;
  };

  useEffect(() => {
    setDisabledColor(pointerIds.length > 0 ? '#333' : '#CCC');
    setDeleteDisabledColor(folderIds?.length > 0 || pointerIds?.length > 0 ? '#333' : '#CCC');
    setMoveDisabledColor(pointerIds.length === 0 || folderIds?.length > 0 ? '#CCC' : '#333');
  }, [folderIds, pointerIds]);

  const resetStatus = () => {
    // 隐藏弹框
    handleModal?.(true);
    setDeleteShow(false);
    setSelectMode(false);
    setFolderIds([]);
    setPointerList([]);
    setPointerIds([]);
  };
  return (
    <View className="flex bg-white w-full">
      {/* 已选列表 */}
      {pointerShow ? (
        <View
          className="w-full bg-gray-100 rounded-t-md border-b border-gray-200 p-4"
          style={{ zIndex: 25, height: 382, bottom: 0 }}
        >
          <View className="relative" style={{ height: 470 }}>
            <XStack justifyContent="space-between">
              <Text style={{ fontSize: 20 }}>{BatchOperation.selectedText}</Text>
              <TouchableOpacity
                onPress={() => {
                  setPointerShow(false);
                }}
              >
                <Close />
              </TouchableOpacity>
            </XStack>
            <FlatList
              className="mb-2 mt-2"
              data={pointerList}
              renderItem={({ item }) => (
                <ExpandGroupListItem
                  item={item}
                  selectMode={true}
                  checkedChange={(flag, item) => {
                    onChangeCurPositionerList(flag, item);
                  }}
                  handleGroupSelect={() => {}}
                />
              )}
              refreshing={false}
              keyExtractor={(item: Record<string, any>) => item.id}
              onRefresh={() => {}}
              onEndReached={async () => {}}
            />
          </View>
        </View>
      ) : null}
      {/* 遮罩 */}
      {pointerShow || deleteShow ? <GroupPointMask bottom={pointerShow ? 152 : 0} /> : null}
      {deleteShow ? (
        <YStack
          space="$2"
          borderRadius="$4"
          padding="$2"
          width={'80%'}
          backgroundColor="#FFF"
          className="fixed top-0 items-center p-4"
          style={{ zIndex: 25, left: '10%', top: '-40%' }}
        >
          <Text className="text-lg font-bold">{BatchOperation.deleteSelected}</Text>
          <Text className="text-base" style={{ marginTop: 4, marginBottom: 6 }}>
            {BatchOperation.deleteNotRevert}
          </Text>
          <XStack className="flex flex-row">
            <Checkbox
              id={`selection__${new Date().getTime()}`}
              size="$4"
              checked={deleteFolder}
              onCheckedChange={() => {
                setDeleteFolder(!deleteFolder);
              }}
              unstyled={deleteFolder}
              className="rounded-2xl bg-white mr-2 border-none"
            >
              <Checkbox.Indicator className="w-full h-full bg-primary items-center justify-center rounded-2xl">
                <Check color="#fff" width="16" height="16" />
              </Checkbox.Indicator>
            </Checkbox>
            <Text>{BatchOperation.deleteWithFolder}</Text>
          </XStack>
          <View className="flex flex-row w-full" style={{ width: '94%', marginTop: 20, marginBottom: 8 }}>
            <Button
              className="text-base bg-white border"
              variant="outlined"
              style={{ width: '48%', borderWidth: 1 }}
              onPress={() => {
                setDeleteShow(false);
                handleModal?.(true);
              }}
            >
              {BatchOperation.cancelText}
            </Button>
            <Button
              backgroundColor="$primaryLight"
              color="$white"
              className="text-base"
              style={{ width: '48%', marginLeft: '4%' }}
              onPress={() => {
                handleDelete({
                  success: () => {
                    resetStatus();
                    toast.show(BatchOperation.deleteSuccess);
                    // 分组点位列表
                    if (page === 'list') {
                      navigation.navigate(ROUTER_FLAG.MapPunterManage);
                      // 地图选择
                    } else {
                      navigation.navigate(ROUTER_FLAG.MapPunterMapSelection);
                    }
                  },
                  fail: () => {
                    setDeleteShow(false);
                    toast.show(BatchOperation.deleteFail);
                  },
                  deleteFolder,
                });
              }}
            >
              {BatchOperation.continueDelete}
            </Button>
          </View>
        </YStack>
      ) : null}
      {/* 操作工具栏 */}
      <TouchableOpacity
        onPress={() => {
          setPointerShow(!pointerShow);
        }}
      >
        <View className="flex flex-row" style={{ marginTop: 4 }}>
          <View style={{ width: 26, height: 26 }} className="rounded-2xl mt-2 ml-2">
            <UpOutlined
              width={26}
              height={26}
              style={{
                marginLeft: 4,
                marginTop: -2,
                transform: pointerShow ? [{ rotate: '180deg' }] : [{ rotate: '0deg' }],
              }}
            />
          </View>
          <Text className="text-teal-500 p-2" style={{ fontSize: 15 }}>
            {/* 展开已选，使用点位统计，否则使用count */}
            {BatchOperation.selectedText}
            <Text className="text-teal-500">{folderIds.length}</Text>
            {BatchOperation.totalFolder}
            <Text className="text-teal-500">{pointerList.length}</Text>
            {BatchOperation.totalPoint}
          </Text>
        </View>
      </TouchableOpacity>
      {/* 工具栏 */}
      <View className="flex flex-row" style={{ marginTop: 10 }}>
        {hasEdit ? (
          <TouchableOpacity
            onPress={() => {
              if (validAction() && pointerIds.length) {
                console.log(pointerList[0]);
                const position = pointerList[0];
                setLocation({ latitude: position?.latitude, longitude: position?.longitude });
                setPointerShow(false);
                navigation.navigate(ROUTER_FLAG.MapPunterBatchEdit);
              }
            }}
          >
            <View className="w-24 h-16 p-2 items-center">
              <BatchEdit color={disabledColor} />
              <Text style={{ color: disabledColor, fontSize: 12 }}>{BatchOperation.batchEdit}</Text>
            </View>
          </TouchableOpacity>
        ) : null}

        {hasDelete ? (
          <TouchableOpacity
            onPress={() => {
              if (validAction()) {
                setPointerShow(false);
                // 隐藏弹框
                handleModal?.(false);
                setTimeout(() => {
                  setDeleteShow(true);
                }, 100);
              }
            }}
          >
            <View className="w-16 h-24 p-2 items-center">
              <BatchDelete color={deleteDisabledColor} />
              <Text style={{ color: deleteDisabledColor, fontSize: 12 }}>{BatchOperation.deleteText}</Text>
            </View>
          </TouchableOpacity>
        ) : null}

        {hasMove ? (
          <TouchableOpacity
            onPress={() => {
              if (folderIds.length > 0) {
                return;
              }
              if (validAction()) {
                setSheetGroupOpen(true);
                // 隐藏弹框
                handleModal?.(false);
              }
            }}
          >
            <View className="w-16 h-24 p-2 items-center">
              <BatchMove color={moveDisabledColor} />
              <Text style={{ color: moveDisabledColor, fontSize: 12 }}>{BatchOperation.moveText}</Text>
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
      {/** 选择分组 */}
      {loading && <ExpandGroupViewToast tip={BatchOperation.movingTip} type="loading" />}
      <View className="flex-1">
        {sheetGroupOpen ? (
          <PunterGroupSheet
            open={sheetGroupOpen}
            onOpenChange={(status) => {
              setSheetGroupOpen(status);
              if (!status) {
                handleModal?.(true);
              }
            }}
            header={BatchOperation.moveText}
            cancelText=""
            handleText={BatchOperation.confirmText}
            cancelAction={() => {}}
            handlerAction={() => {
              setLoading(true);
              try {
                handleMove({
                  success: () => {
                    resetStatus();
                    toast.show(BatchOperation.moveSuccess);
                    navigation.navigate(ROUTER_FLAG.MapPunterManage);
                  },
                  fail: () => {
                    toast.show(BatchOperation.moveFailure);
                    setLoading(false);
                  },
                });
              } catch (err) {
                setLoading(false);
              }
            }}
          />
        ) : null}
      </View>
    </View>
  );
});

/**
 * @conponent     GroupPointMask
 * @returns
 */
export const GroupPointMask = (props: { bottom: number; onPress?: () => void }) => {
  const { bottom = 132, onPress = null } = props;
  return (
    <View
      onPress={() => {
        if (onPress) {
          onPress();
        }
      }}
      className="absolute w-full"
      style={{ backgroundColor: 'rgba(0,0,0, 0.3)', zIndex: 2, height: 1280, bottom: bottom }}
    />
  );
};
