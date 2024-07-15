import { Button, Sheet, SheetProps, Text, View, XStack, YStack } from 'tamagui';
import { useIconList } from '../../hooks';
import { AddCirclePrimary, CheckCircle, Close } from '@/src/icons';
import { useCallback, useState } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { Toast, ToastToken } from '@/src/interfaces/notifications';
import { useDependency } from '@/src/ioc';
import { ChoosePhotoCameraSheet } from '.';

export const IconSheet = ({
  value = [],
  onChange,
  ...props
}: SheetProps & {
  value: any[];
  onChange: (res: any[]) => void;
}) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { iconList, delIcons, addIcons, getIconsList } = useIconList();
  const [isEdit, setIsEdit] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<any>(value);
  const toast = useDependency<Toast>(ToastToken);
  const onDelete = useCallback(() => {
    const ids = selectedIcon?.map(({ id }: any) => id);
    if (ids.length === 0) {
      toast.show('请选择图标');
      return;
    }
    delIcons({ ids }).then(() => {
      getIconsList();
    });
  }, [delIcons, getIconsList, selectedIcon, toast]);

  const onChooseChange = useCallback(
    async (res: string[]) => {
      await addIcons({ url: res });
      getIconsList();
    },
    [addIcons, getIconsList],
  );

  return (
    <Sheet dismissOnOverlayPress={false} animation="medium" modal snapPoints={[70]} native {...props}>
      <Sheet.Overlay animation="medium" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Frame flex={1}>
        <XStack justifyContent="space-between" marginBottom={0} paddingHorizontal={24} paddingTop={12}>
          <Text className="text-xl font-medium" style={{ color: '#141414' }}>
            图标填充
          </Text>
          <TouchableOpacity
            onPress={() => {
              setIsEdit(false);
              props.onOpenChange?.(false);
            }}
          >
            <Close />
          </TouchableOpacity>
        </XStack>
        <Sheet.ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
          <YStack padding={12} backgroundColor="#F5F5F5">
            {!isEdit ? (
              <XStack backgroundColor="$white" padding={12} space="$3" borderRadius="$3" alignItems="center">
                <TouchableOpacity
                  onPress={() => {
                    setSheetOpen(true);
                  }}
                >
                  <View
                    className="rounded-lg w-12 h-12 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,187,180,0.1)' }}
                  >
                    <AddCirclePrimary />
                  </View>
                </TouchableOpacity>
                <YStack space="$1">
                  <Text color="#00BBB4">添加新图片</Text>
                  <Text fontSize={12} color="#B8B8B8">
                    添加后成员均可使用
                  </Text>
                </YStack>
              </XStack>
            ) : null}

            {!isEdit ? (
              <XStack justifyContent="space-between" marginTop={24}>
                <Text>请选择要填充的图片</Text>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedIcon([]);
                    setIsEdit(true);
                  }}
                >
                  <Text color="#5E5E5E">图片管理</Text>
                </TouchableOpacity>
              </XStack>
            ) : (
              <XStack marginTop={24}>
                <Text>请选择要删除的图片</Text>
              </XStack>
            )}

            <XStack
              borderRadius="$3"
              backgroundColor="$white"
              flexWrap="wrap"
              padding={16}
              rowGap="$2.5"
              marginTop={16}
            >
              {iconList?.map((icon: any) => {
                const checked = selectedIcon?.find(({ id }: any) => id === icon?.id);
                return (
                  <TouchableOpacity
                    key={icon?.id}
                    onPress={() => {
                      if (!isEdit) {
                        setSelectedIcon([icon]);
                      } else {
                        setSelectedIcon(
                          checked
                            ? [...(selectedIcon ?? []).filter(({ id }: any) => id !== icon?.id)]
                            : [...(selectedIcon ?? []), icon],
                        );
                      }
                    }}
                  >
                    <View style={{ width: 58, height: 58, marginLeft: 4, marginRight: 4 }}>
                      <Image
                        source={{
                          uri: icon?.url,
                          width: 58,
                          height: 58,
                        }}
                        className="relative"
                        borderRadius={8}
                        style={checked ? { borderColor: '#00BBB4', borderWidth: 1 } : {}}
                      />

                      {checked ? (
                        <View
                          className="absolute w-full h-full justify-center items-center"
                          style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
                        >
                          <CheckCircle />
                        </View>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </XStack>
          </YStack>
        </Sheet.ScrollView>
        {!isEdit ? (
          <YStack backgroundColor="$white" padding="$4" bottom={0}>
            <Button
              backgroundColor="#00BBB4"
              color="white"
              onPress={() => {
                onChange?.(selectedIcon);
                props.onOpenChange?.(false);
              }}
              fontSize={16}
            >
              确定
            </Button>
          </YStack>
        ) : (
          <XStack bottom={0} padding="$4" backgroundColor="$white" justifyContent="space-between" space="$2">
            <Button
              onPress={() => {
                setIsEdit(false);
                setSelectedIcon([]);
              }}
              borderWidth={1}
              borderColor={'#DCDCDC'}
              backgroundColor={'white'}
              color="#5E5E5E"
              flex={1}
              fontSize={16}
            >
              取消
            </Button>
            <Button fontSize={16} backgroundColor="#F53F3F" color="white" flex={1} onPress={onDelete}>
              删除
            </Button>
          </XStack>
        )}

        {sheetOpen ? (
          <ChoosePhotoCameraSheet onChange={onChooseChange} open={sheetOpen} onOpenChange={setSheetOpen} />
        ) : null}
      </Sheet.Frame>
    </Sheet>
  );
};
