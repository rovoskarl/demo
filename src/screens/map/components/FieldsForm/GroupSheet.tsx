import { Button, Input, ListItem, RadioGroup, Sheet, Text, View, XStack, YStack, debounce } from 'tamagui';
import { useAddGroup, useGroupList } from '../../hooks';
import { AddCirclePrimary, Check, Close, Folder, Right, Search } from '@/src/icons';
import { useCallback, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Breadcrumb, WithAuth } from '@/src/components';
import { ButtonPermission } from '../../constant/constants';
import { CreateGroupSheet } from '.';

export const GroupSheet = WithAuth((props: any) => {
  const { permissions, value, onChange } = props;
  const hasCreateGroup = permissions?.find((item: any) => item.url === ButtonPermission.CreateGroup);

  const [createGroupSheetOpen, setCreateGroupSheetOpen] = useState(false);
  const { list, getGroupList } = useGroupList();
  const [groupId, setGroupId] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string | null; name: string }[]>([{ id: null, name: '列表' }]);
  const { addGroup: addGroupService } = useAddGroup();
  const [inputValue, setInputValue] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<any>(value);
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

  const debounceOnPress = debounce((group: any) => {
    setGroupId(group?.id);
    getGroupList({ parentId: group?.id });
    setBreadcrumbs((prev) => [...prev, { id: group?.id, name: group?.name }]);
  }, 1000);

  return (
    <Sheet dismissOnOverlayPress={false} animation="medium" modal snapPoints={[70]} native {...props}>
      <Sheet.Overlay animation="medium" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Frame flex={1}>
        <XStack justifyContent="space-between" paddingHorizontal={24} paddingTop={12} alignItems="center">
          <Text className="text-xl font-medium">选择分组</Text>
          <TouchableOpacity onPress={() => props.onOpenChange?.(false)}>
            <Close />
          </TouchableOpacity>
        </XStack>
        <Sheet.ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
          <YStack padding={12} space="$3" backgroundColor="#F5F5F5">
            <XStack backgroundColor="$white" borderRadius={8} alignItems="center" paddingLeft="$3">
              <Search marginTop={3} width={16} height={16} />
              <Input
                borderWidth={0}
                value={inputValue}
                flex={1}
                paddingLeft={10}
                placeholder="搜索"
                backgroundColor="$white"
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
                  <View
                    className="rounded-lg w-12 h-12 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,187,180,0.1)' }}
                  >
                    <AddCirclePrimary />
                  </View>
                </TouchableOpacity>
                <YStack space="$1">
                  <Text color="#00BBB4">点击创建新分组</Text>
                </YStack>
              </XStack>
            ) : null}

            {_list.length > 0 ? (
              <RadioGroup
                name="form"
                value={selectedGroup?.id}
                onValueChange={(res) => {
                  const group = _list.find((item: any) => item.id === res);
                  setSelectedGroup(group);
                }}
              >
                <YStack space="$3">
                  {_list.map((group: any) => {
                    return (
                      <ListItem
                        key={group?.id}
                        icon={<Folder />}
                        padding="$4"
                        borderRadius={8}
                        backgroundColor="#fff"
                        onPress={() => {
                          debounceOnPress(group);
                        }}
                        flex={1}
                      >
                        <XStack flex={1} justifyContent="space-between" alignItems="center">
                          <XStack alignItems="center" space="$2">
                            <Text ellipsizeMode="tail" numberOfLines={1} maxWidth="60%">
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
        <YStack backgroundColor="$white" padding="$4" bottom={10}>
          <Button
            backgroundColor="#00BBB4"
            color="white"
            onPress={() => {
              onChange?.(selectedGroup);
              props.onOpenChange?.(false);
            }}
            fontSize={16}
          >
            确定
          </Button>
        </YStack>
        {createGroupSheetOpen ? (
          <CreateGroupSheet open={createGroupSheetOpen} onOpenChange={setCreateGroupSheetOpen} addGroup={addGroup} />
        ) : null}
      </Sheet.Frame>
    </Sheet>
  );
});
