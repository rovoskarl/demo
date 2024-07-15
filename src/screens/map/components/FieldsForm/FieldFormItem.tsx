import { Checkbox, Image, Input, Label, RadioGroup, ScrollView, Text, TextArea, View, XStack, YStack } from 'tamagui';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Add, Check, CloseCircle, Link, Right } from '@/src/icons';
import { useState } from 'react';
import { ImageBackground, TouchableOpacity } from 'react-native';
import { Toast, ToastToken } from '@/src/interfaces/notifications';
import { Colors } from '../Colors';
import DocumentPicker from 'react-native-document-picker';
import Video, { ResizeMode } from 'react-native-video';
import { PreviewImage } from '../PreviewImage';
import { useOSSClient } from '../../hooks/useOSSClient';
import { useDependency } from '@/src/ioc';
import { Pdf } from '@/src/icons/Pdf';
import { ChoosePhotoCameraSheet, FieldTitle, FieldsTypeEnum, GroupSheet, IconSheet, isVideoUrl } from '.';
import { markerLocationBgIcons } from '../../constant/constants';

export const FieldFormItem = ({
  item,
  value,
  onChange,
  onPositionChange,
  disabled,
  onlyShowContent,
  color,
}: {
  color?: number[];
  item: {
    id: number;
    isSystem?: boolean;
    type: FieldsTypeEnum;
    fieldName: string;
    fieldCode?: string;
    required?: boolean;
    description?: string;
    options?: {
      value: number;
      description: string;
    }[];
  };
  disabled?: boolean;
  onlyShowContent?: boolean;
  value?: any;
  onChange?: (value: any) => void;
  onPositionChange?: () => void;
}) => {
  const { type } = item;
  const toast = useDependency<Toast>(ToastToken);
  const { uploadFile, getFileUrl } = useOSSClient();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [sheetIconOpen, setSheetIconOpen] = useState(false);
  const [sheetGroupOpen, setSheetGroupOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [previewUri, setPreviewUri] = useState<null | string>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const bgImgUrl = markerLocationBgIcons[(color || [])[0]];
  const onHandleChange = (
    fieldValue:
      | string
      | number
      | number[]
      | {
          name: string;
          url: string;
        }[],
  ) => {
    onChange?.(fieldValue);
  };

  const selectFile = async () => {
    try {
      const res: any = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      if (res?.size > 1024 * 1024 * 20) {
        toast.show('文件大小不能超过 20M');
        return;
      }

      const key = (await uploadFile(res.uri))?.fileName;
      const url = await getFileUrl(key);
      onHandleChange([...(value || []), { name: '', url }]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        throw err;
      }
    }
  };

  const { options = [], fieldName } = item;

  const boxStyles = onlyShowContent
    ? {
        paddingTop: 12,
        paddingBottom: 12,
      }
    : {
        borderBottomColor: '#F0F0F0',
        borderBottomWidth: 0.5,
        paddingTop: 16,
        paddingBottom: 16,
      };

  return (
    <View {...boxStyles}>
      {type === FieldsTypeEnum.TEXT && (
        <View>
          {!onlyShowContent && (
            <FieldTitle fieldName={item?.fieldName} required={item?.required} description={item?.description} />
          )}
          <TextArea
            unstyled
            disabled={disabled}
            value={value}
            onChangeText={onChange}
            className="border-0 bg-white p-0 mt-1 rounded-none text-[#5e5e5e]"
            placeholderTextColor={'#b8b8b8'}
            placeholder={`添加${item?.fieldName}`}
          />
        </View>
      )}
      {type === FieldsTypeEnum.SINGLE_CHOICE && (
        <View>
          {!onlyShowContent && (
            <FieldTitle fieldName={item?.fieldName} required={item?.required} description={item?.description} />
          )}
          <RadioGroup
            disabled={disabled}
            name="form"
            value={value}
            onValueChange={(res) => onHandleChange(res)}
            className="mt-3"
          >
            <YStack space="$2">
              {options?.map((field: any) => {
                const id = `${fieldName}-${field?.description}-${field?.value}`;
                return (
                  <XStack space={10} key={id}>
                    <RadioGroup.Item value={field?.value} id={id} backgroundColor="$white">
                      <RadioGroup.Indicator className="w-full h-full bg-primary items-center justify-center">
                        <Check color="#fff" width="16" height="16" />
                      </RadioGroup.Indicator>
                    </RadioGroup.Item>

                    <Label htmlFor={id} color={'#5e5e5e'}>
                      {field?.description}
                    </Label>
                  </XStack>
                );
              })}
            </YStack>
          </RadioGroup>
        </View>
      )}
      {type === FieldsTypeEnum.MULTIPLE_CHOICE && (
        <View>
          {!onlyShowContent && (
            <FieldTitle fieldName={item?.fieldName} required={item?.required} description={item?.description} />
          )}
          <YStack space="$2" className="mt-3">
            {options?.map((field: any) => {
              const id = `${fieldName}-${field?.description}-${field?.value}`;
              return (
                <XStack space="$4" key={id}>
                  <Checkbox
                    size="$5"
                    id={id}
                    borderRadius={0}
                    disabled={disabled}
                    value={value}
                    checked={value?.includes(field?.value) ? true : false}
                    backgroundColor="$white"
                    onCheckedChange={(checked) =>
                      onHandleChange(
                        checked ? [...(value || []), field?.value] : value?.filter((i: any) => i !== field?.value),
                      )
                    }
                  >
                    <Checkbox.Indicator style={{ backgroundColor: '#00BBB4' }}>
                      <Check color="#fff" width="22" height="22" />
                    </Checkbox.Indicator>
                  </Checkbox>

                  <Label htmlFor={id} color={'#5e5e5e'}>
                    {field?.description}
                  </Label>
                </XStack>
              );
            })}
          </YStack>
        </View>
      )}

      {type === FieldsTypeEnum.NUMBER && (
        <View>
          {!onlyShowContent && (
            <FieldTitle fieldName={item?.fieldName} required={item?.required} description={item?.description} />
          )}
          <Input
            unstyled
            disabled={disabled}
            keyboardType="numeric"
            style={{ marginBottom: -4 }}
            className="border-0 bg-white p-0 mt-1 rounded-none text-[#5e5e5e]"
            placeholderTextColor={'#b8b8b8'}
            placeholder={`添加${item?.fieldName}`}
            value={value}
            onChangeText={onChange}
          />
        </View>
      )}
      {type === FieldsTypeEnum.DATE && (
        <XStack alignItems="center" justifyContent="space-between" space="$2">
          {!onlyShowContent && (
            <FieldTitle fieldName={item?.fieldName} required={item?.required} description={item?.description} />
          )}
          <XStack>
            <XStack space="$2" alignItems="center">
              <TouchableOpacity onPress={() => !disabled && setDatePickerVisibility(true)}>
                <XStack alignItems="center" justifyContent="flex-end" space="$2">
                  {value ? (
                    <Text className="text-right text-[#5e5e5e]" numberOfLines={1} ellipsizeMode="tail">
                      {new Date(isNaN(+value) ? value : +value).toLocaleDateString()}
                    </Text>
                  ) : (
                    <Text className="text-right text-[#b8b8b8]" numberOfLines={1} ellipsizeMode="tail">
                      选择日期
                    </Text>
                  )}

                  <Right color="#858585" />
                </XStack>
              </TouchableOpacity>
              <DateTimePickerModal
                confirmButtonTestID=""
                buttonTextColorIOS="#00BBB4"
                isVisible={isDatePickerVisible}
                mode="date"
                cancelTextIOS="取消"
                confirmTextIOS="确认"
                date={value ? new Date(Number(value)) : new Date()}
                onConfirm={(date) => {
                  setDatePickerVisibility(false);
                  onHandleChange(new Date(date as Date).getTime());
                }}
                onCancel={() => setDatePickerVisibility(false)}
              />
            </XStack>
          </XStack>
        </XStack>
      )}
      {type === FieldsTypeEnum.LINK && (
        <View>
          {!onlyShowContent && (
            <FieldTitle fieldName={item?.fieldName} required={item?.required} description={item?.description} />
          )}
          <XStack alignItems="center" space="$2" paddingTop={4}>
            <Link />
            <TextArea
              unstyled
              disabled={disabled}
              style={{ marginBottom: -4 }}
              value={value}
              onChangeText={onChange}
              className="border-0 bg-white p-0 rounded-none text-[#5e5e5e]"
              placeholderTextColor={'#b8b8b8'}
              placeholder={`添加${item?.fieldName}`}
            />
          </XStack>
        </View>
      )}
      {type === FieldsTypeEnum.IMAGE && (
        <XStack alignItems="center" justifyContent="space-between" space="$2">
          {!onlyShowContent && (
            <FieldTitle fieldName={item?.fieldName} required={item?.required} description={item?.description} />
          )}
          <XStack space="$2" flex={1} justifyContent="flex-end">
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <XStack space="$2">
                  {value?.map((uri: any, index: number) => {
                    const isVideo = isVideoUrl(uri.url);
                    return (
                      <View className="relative" key={uri.url + index}>
                        <TouchableOpacity
                          onPress={() => {
                            setPreviewUri(uri.url);
                            setModalVisible(true);
                          }}
                        >
                          {isVideo ? (
                            <Video
                              style={{
                                width: 56,
                                height: 56,
                              }}
                              resizeMode={ResizeMode.COVER}
                              source={{
                                uri: uri.url,
                              }}
                              controls={false}
                              paused={true}
                            />
                          ) : (
                            <Image
                              source={{
                                uri: uri.url,
                                width: 56,
                                height: 56,
                              }}
                            />
                          )}
                        </TouchableOpacity>

                        {!disabled && (
                          <TouchableOpacity
                            style={{ position: 'absolute', top: 0, right: 0 }}
                            onPress={() => {
                              const newImages = value?.filter((url: any) => url !== uri);
                              onHandleChange(newImages);
                            }}
                          >
                            <CloseCircle />
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })}
                  {(value || []).length < 9 && !disabled ? (
                    <TouchableOpacity
                      onPress={() => {
                        setSheetOpen(true);
                      }}
                    >
                      <View className="w-14 h-14 bg-bgColor rounded-lg flex items-center justify-center">
                        <Add width={12} height={12} color="#888888" />
                      </View>
                    </TouchableOpacity>
                  ) : null}
                </XStack>
              </ScrollView>
            </View>
            {sheetOpen ? (
              <ChoosePhotoCameraSheet
                onChange={(res: any[]) => {
                  onHandleChange([...(value || []), ...res.map((url: any, index) => ({ name: index, url: url }))]);
                }}
                open={sheetOpen}
                onOpenChange={setSheetOpen}
              />
            ) : null}
            {modalVisible ? (
              <PreviewImage
                uri={previewUri}
                setModalVisible={() => {
                  setPreviewUri(null);
                  setModalVisible(!modalVisible);
                }}
                modalVisible={modalVisible}
              />
            ) : null}
          </XStack>
        </XStack>
      )}
      {type === FieldsTypeEnum.FILE && (
        <XStack alignItems="center" justifyContent="space-between" space="$2">
          {!onlyShowContent && (
            <FieldTitle fieldName={item?.fieldName} required={item?.required} description={item?.description} />
          )}

          <XStack space="$2" flex={1} className="mt-3">
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <XStack space="$2">
                  {(value || []).length < 9 && !disabled ? (
                    <TouchableOpacity
                      onPress={() => {
                        selectFile();
                      }}
                    >
                      <View className="w-14 h-14 bg-bgColor rounded-lg flex items-center justify-center">
                        <Add width={24} height={24} />
                      </View>
                    </TouchableOpacity>
                  ) : null}
                  {value?.map(({ url: uri, name }: any, index: number) => {
                    return (
                      <YStack justifyContent="center" key={uri + index}>
                        <View className="relative w-14 h-14 bg-bgColor items-center justify-center">
                          <Pdf />
                          {!disabled && (
                            <TouchableOpacity
                              style={{ position: 'absolute', top: 0, right: 0 }}
                              onPress={() => {
                                const newFiles = value?.filter(({ url }: any) => url !== uri);
                                onHandleChange(newFiles);
                              }}
                            >
                              <CloseCircle />
                            </TouchableOpacity>
                          )}
                        </View>
                        <Text fontSize={12} width={56} marginTop="$1" numberOfLines={1} ellipsizeMode="tail">
                          {name}
                        </Text>
                      </YStack>
                    );
                  })}
                </XStack>
              </ScrollView>
            </View>
          </XStack>
        </XStack>
      )}
      {[FieldsTypeEnum.AREA, FieldsTypeEnum.LOCATION, FieldsTypeEnum.ADDRESS].includes(type) && (
        <XStack alignItems="center" justifyContent="space-between" space="$2">
          {!onlyShowContent && (
            <FieldTitle fieldName={item?.fieldName} required={item?.required} description={item?.description} />
          )}
          <TouchableOpacity
            onPress={() => {
              if (!disabled) {
                onPositionChange?.();
              }
            }}
          >
            <XStack flex={1} alignItems="center" justifyContent="flex-end" space="$2" paddingRight="$2">
              <Text maxWidth={'$20'} className="text-right text-[#5e5e5e]" numberOfLines={1} ellipsizeMode="tail">
                {value}
              </Text>
              <Right color="#858585" />
            </XStack>
          </TouchableOpacity>
        </XStack>
      )}
      {type === FieldsTypeEnum.COLOR && (
        <XStack alignItems="center" justifyContent="space-between" space="$2">
          {!onlyShowContent && (
            <FieldTitle fieldName={item?.fieldName} required={item?.required} description={item?.description} />
          )}
          <Colors isSingle value={value || []} onChange={(newKey: number[]) => !disabled && onHandleChange(newKey)} />
        </XStack>
      )}

      {type === FieldsTypeEnum.ICON && (
        <View>
          <XStack alignItems="center" justifyContent="space-between" space="$2">
            {!onlyShowContent && (
              <FieldTitle fieldName={item?.fieldName} required={item?.required} description={item?.description} />
            )}
            <TouchableOpacity onPress={() => !disabled && setSheetIconOpen(true)}>
              <XStack alignItems="center" justifyContent="flex-end" space="$2">
                {value?.[0]?.url ? (
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
                      style={{ borderRadius: 3, marginLeft: 5, marginTop: 5 }}
                      source={{
                        uri: value?.[0]?.url,
                        width: 30,
                        height: 30,
                      }}

                      // style={{ borderWidth: 3, borderColor: '#7F93F8', borderRadius: 8 }}
                    />
                  </ImageBackground>
                ) : (
                  <Text className="text-right text-[#b8b8b8]" numberOfLines={1} ellipsizeMode="tail">
                    选择填充
                  </Text>
                )}

                <Right color="#858585" />
              </XStack>
            </TouchableOpacity>
          </XStack>
          {sheetIconOpen ? (
            <IconSheet value={value} onChange={onHandleChange} open={sheetIconOpen} onOpenChange={setSheetIconOpen} />
          ) : null}
        </View>
      )}
      {type === FieldsTypeEnum.GROUP && (
        <View>
          <XStack alignItems="center" justifyContent="space-between" space="$2">
            {!onlyShowContent && (
              <FieldTitle fieldName={item?.fieldName} required={item?.required} description={item?.description} />
            )}
            <TouchableOpacity onPress={() => !disabled && setSheetGroupOpen(true)}>
              <XStack alignItems="center" justifyContent="flex-end" space="$2">
                {value ? (
                  <Text className="text-right text-[#5e5e5e]" numberOfLines={1} ellipsizeMode="tail">
                    {value?.name}
                  </Text>
                ) : (
                  <Text className="text-right text-[#b8b8b8]" numberOfLines={1} ellipsizeMode="tail">
                    选择分组
                  </Text>
                )}

                <Right color="#858585" />
              </XStack>
            </TouchableOpacity>
          </XStack>

          {sheetGroupOpen ? (
            <GroupSheet
              value={value}
              onChange={onHandleChange}
              open={sheetGroupOpen}
              onOpenChange={setSheetGroupOpen}
            />
          ) : null}
        </View>
      )}
    </View>
  );
};
