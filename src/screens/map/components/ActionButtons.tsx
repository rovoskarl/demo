import {
  Administrative,
  AdministrativeActive,
  Check,
  Close,
  List,
  Position,
  SatelliteMap,
  SatelliteMapActive,
  Show,
  ShowName,
  ShowNameActive,
  StandardMap,
  StandardMapActive,
} from '@/src/icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Label, RadioGroup, Separator, Sheet, SheetProps, Text, XStack, YStack } from 'tamagui';
import { useShowConfig } from '../hooks';
import { WithAuth, useTheme } from '@/src/components';
import { ButtonPermission } from '../constant/constants';

export const PositionButton = ({ onPress, bottom = '22%' }: { onPress: () => void; bottom?: string | undefined }) => {
  const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      right: 12,
      bottom: bottom as any,
    },
  });

  return (
    <TouchableOpacity style={styles.fab} onPress={onPress} className="bg-white rounded-xl px-1.5 py-2">
      <Position height={28} width={28} />
    </TouchableOpacity>
  );
};

export const PositionButtonWithGroup = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Position />
    </TouchableOpacity>
  );
};

export const ListButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <YStack alignItems="center">
      <TouchableOpacity onPress={onPress}>
        <List />
      </TouchableOpacity>
      <Text fontSize={12}>列表</Text>
    </YStack>
  );
};

export const ShowButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <YStack alignItems="center">
      <TouchableOpacity onPress={onPress}>
        <Show />
      </TouchableOpacity>
      <Text fontSize={12}>显示</Text>
    </YStack>
  );
};

export const ActionButtonGroup = WithAuth(({ permissions, onPosition, onShow, onList }: any) => {
  const hasList = permissions?.find((item: any) => item.url === ButtonPermission.List);
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <>
      <YStack className="absolute right-3 bg-white rounded-2xl" bottom={110} padding="$2" space="$2">
        {hasList ? (
          <ListButton
            onPress={() => {
              onList && onList();
            }}
          />
        ) : null}

        <Separator />
        <ShowButton
          onPress={() => {
            setSheetOpen(true);
          }}
        />
        <Separator />
        <PositionButtonWithGroup
          onPress={() => {
            onPosition && onPosition();
          }}
        />
      </YStack>
      <ShowSheet open={sheetOpen} onOpenChange={setSheetOpen} onUpdate={onShow} />
    </>
  );
});

export const ShowSheet = (props: SheetProps & { onUpdate: () => void }) => {
  const { config, update } = useShowConfig();
  // 1: 显示内容 2: 地图风格
  const [type, setType] = useState<1 | 2>(1);

  const [{ mapType, isShowAdministrative, isShowName, isKeep }, setConfig] = useState({
    isShowAdministrative: config?.isShowAdministrative,
    isShowName: config?.isShowName,
    isKeep: config?.isKeep,
    // 1 标准地图 2 卫星地图
    mapType: config?.mapType,
  });

  const theme = useTheme();

  useEffect(() => {
    setConfig(config);
  }, [config]);

  return (
    <Sheet dismissOnOverlayPress animation="medium" modal snapPoints={[38]} native {...props}>
      <Sheet.Overlay animation="medium" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Frame flex={1} backgroundColor="$white" paddingHorizontal={12} paddingTop={12} paddingBottom={8}>
        <Sheet.ScrollView showsVerticalScrollIndicator={false}>
          <YStack space="$3">
            <XStack space="$2" justifyContent="space-between" alignItems="center" paddingHorizontal={12}>
              <XStack space="$4">
                <TouchableOpacity
                  onPress={() => {
                    setType(1);
                  }}
                >
                  <Text
                    color={type === 1 ? theme?.colors?.primary.DEFAULT : '#141414'}
                    style={{ fontSize: 16, fontWeight: 500 }}
                  >
                    显示内容
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setType(2);
                  }}
                >
                  <Text
                    color={type === 2 ? theme?.colors?.primary.DEFAULT : '#141414'}
                    style={{ fontSize: 16, fontWeight: 500 }}
                  >
                    地图风格
                  </Text>
                </TouchableOpacity>
              </XStack>
              <TouchableOpacity
                onPress={() => {
                  // setConfig({ isShowAdministrative: false, isShowName: true, isKeep: false, mapType: 1 });
                  props.onOpenChange?.(false);
                }}
              >
                <Close />
              </TouchableOpacity>
            </XStack>
            {type === 1 ? (
              <XStack space="$3" marginTop={24} paddingHorizontal={8}>
                <YStack alignItems="center">
                  <TouchableOpacity
                    onPress={() => {
                      setConfig((c) => ({ ...c, isShowAdministrative: !isShowAdministrative }));
                    }}
                  >
                    {isShowAdministrative ? <AdministrativeActive /> : <Administrative />}
                  </TouchableOpacity>
                  <Text color={isShowAdministrative ? theme?.colors?.primary.DEFAULT : '#5E5E5E'} marginTop={4}>
                    行政分块
                  </Text>
                </YStack>

                <YStack alignItems="center">
                  {/* 显示名称 */}
                  <TouchableOpacity
                    onPress={() => {
                      setConfig((c) => ({ ...c, isShowName: !isShowName }));
                    }}
                  >
                    {isShowName ? <ShowNameActive /> : <ShowName />}
                  </TouchableOpacity>
                  <Text color={isShowName ? theme?.colors?.primary.DEFAULT : '#5E5E5E'} marginTop={4}>
                    显示名称
                  </Text>
                </YStack>
              </XStack>
            ) : null}
            {type === 2 ? (
              <XStack space="$3" marginTop={24} paddingHorizontal={8}>
                <YStack alignItems="center">
                  <TouchableOpacity
                    onPress={() => {
                      setConfig((c) => ({ ...c, mapType: 1 }));
                    }}
                  >
                    {mapType === 1 ? <StandardMapActive /> : <StandardMap />}
                  </TouchableOpacity>
                  <Text color={mapType === 1 ? theme?.colors?.primary.DEFAULT : '#5E5E5E'} marginTop={4}>
                    标准地图
                  </Text>
                </YStack>

                <YStack alignItems="center">
                  <TouchableOpacity
                    onPress={() => {
                      setConfig((c) => ({ ...c, mapType: 2 }));
                    }}
                  >
                    {mapType === 2 ? <SatelliteMapActive /> : <SatelliteMap />}
                  </TouchableOpacity>
                  <Text color={mapType === 2 ? theme?.colors?.primary.DEFAULT : '#5E5E5E'} marginTop={4}>
                    卫星地图
                  </Text>
                </YStack>
              </XStack>
            ) : null}
          </YStack>
        </Sheet.ScrollView>
        <XStack alignItems="center" justifyContent="center" marginBottom={24}>
          <RadioGroup
            aria-labelledby="Select one item"
            value={isKeep ? '1' : '0'}
            name="form"
            onValueChange={(value) => {
              if (value === '1') {
                setConfig((c) => ({ ...c, isKeep: !isKeep }));
              }
            }}
          >
            <RadioGroupItemWithLabel
              value="1"
              label="对我的所有地图生效"
              onPress={() => {
                setConfig((c) => ({ ...c, isKeep: !isKeep }));
              }}
            />
          </RadioGroup>
        </XStack>
        <YStack bottom={10}>
          <Button
            backgroundColor="#00BBB4"
            color="white"
            onPress={() => {
              update({ isShowAdministrative, isShowName, isKeep, mapType });
              props.onOpenChange?.(false);
              props.onUpdate?.();
            }}
          >
            保存
          </Button>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};

export function RadioGroupItemWithLabel(props: { value: string; label: string; onPress: () => void }) {
  const id = `radiogroup-${props.value}`;
  return (
    <XStack alignItems="center" space="$2">
      <RadioGroup.Item value={props.value} id={id} backgroundColor="$white">
        <RadioGroup.Indicator className="w-full h-full bg-primary items-center justify-center" onPress={props.onPress}>
          <Check color="#fff" width="16" height="16" />
        </RadioGroup.Indicator>
      </RadioGroup.Item>
      <Label htmlFor={id}>{props.label}</Label>
    </XStack>
  );
}
