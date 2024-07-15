import { Button, Spinner, Text, View, XStack, YStack } from 'tamagui';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import {
  useCustomFieldGroupDetail,
  useLocation,
  useMapInfo,
  usePrevFieldsFormValues,
  useRenderType,
} from '../../hooks';
import { CollapseCard } from '@/src/components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FieldFormItem,
  FieldsTypeEnum,
  TCustomFieldGroupDetail,
  getFieldListByFieldGroupDetail,
  getPositionCustomFields,
  positionDetailToFormValue,
} from '.';
import { useDependency } from '@/src/ioc';
import { Toast, ToastToken } from '@/src/interfaces/notifications';
import { debounce, toArray, uniq } from 'lodash-es';
import { ROUTER_FLAG, ScreenNavigationProp } from '@/src/navigation';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { primary } from '@/src/components/Theme/colors';
import { useLoader } from '@/src/hooks';

type IProps = {
  templateId?: number;
  disabled?: boolean;
  disabledFieldTypes?: FieldsTypeEnum[];
  isEdit?: boolean;
  data?: Record<string, any>;
  buttonText?: string;
  hideSystemFields?: boolean;
  canScroll?: boolean;
  storageFieldFormValue?: Record<string, any>;
  onValueChange?: (data: Record<string, any>) => void;
  onSubmit?: (data: Record<string, any>) => Promise<void> | undefined;
};

export const FieldsForm = ({
  templateId,
  disabled,
  disabledFieldTypes,
  isEdit,
  data: detail,
  buttonText,
  hideSystemFields,
  storageFieldFormValue,
  canScroll = true,
  onValueChange,
  onSubmit,
}: IProps) => {
  const { customFieldGroupDetail, loading }: { customFieldGroupDetail: TCustomFieldGroupDetail; loading: boolean } =
    useCustomFieldGroupDetail(templateId);
  const toast = useDependency<Toast>(ToastToken);
  const { update } = useRenderType();
  const navigation = useNavigation<ScreenNavigationProp>();
  const { setVisible } = useLoader();
  const {
    mapInfo: { id: mapId },
  } = useMapInfo();
  const { prevValues, setPrevValues, cleanPrevValues } = usePrevFieldsFormValues();

  const {
    location: { latitude, longitude },
    locationInfo,
  } = useLocation();

  const [color, setColor] = useState<number[]>([1]);
  const [hideFields, setHideFields] = useState<number[]>([]);

  const defaultValues: Record<string, any> = useMemo(() => {
    return {
      address: locationInfo?.address,
      name: locationInfo?.name,
      adCode: locationInfo?.adcode || locationInfo?.adCode,
      lnglat: [longitude, latitude].join(','),
      area: [locationInfo?.pname, locationInfo?.cityname, locationInfo?.adname].join(','),
    };
  }, [latitude, locationInfo, longitude]);

  const { control, reset, handleSubmit, getValues, watch } = useForm({ defaultValues: defaultValues });

  // 根据规则获取需要隐藏的字段
  const getHideFields = useCallback(
    (values: Record<number, unknown>) =>
      debounce(() => {
        const hideFieldList: number[] = [];

        customFieldGroupDetail?.levels?.forEach((oneLevel) => {
          oneLevel.children?.forEach((twoLevel) => {
            twoLevel.fields?.forEach((field) => {
              const hide =
                field.showRules?.length &&
                field.showRules.find((rule) => {
                  const { cascadeFieldId, fieldValue } = rule;

                  const key = Object.keys(values).find((k) => +k === cascadeFieldId);

                  return fieldValue.find((v) => key && v === values[+key]) === undefined;
                });

              if (field.showRules && hide) {
                hideFieldList.push(field.id);
              }
            });
          });
        });
        setHideFields(uniq(hideFieldList));
      }, 300)(),
    [customFieldGroupDetail?.levels],
  );

  useEffect(() => {
    if (isEdit) {
      const data = { ...(detail || {}), ...(detail?.shopPosition || {}) };

      const formValue = positionDetailToFormValue(data);
      getHideFields(formValue);
      reset(formValue);
    }
  }, [detail, getHideFields, isEdit, reset]);

  useFocusEffect(
    useCallback(() => {
      if (!customFieldGroupDetail?.levels || disabled) {
        return;
      }
      const newValue = {
        ...(prevValues || {}),
        ...(storageFieldFormValue || {}),
        address: locationInfo?.address,
        adCode: locationInfo?.adcode || locationInfo?.adCode,
        lnglat: [longitude, latitude].join(','),
        area: [locationInfo?.pname, locationInfo?.cityname, locationInfo?.adname].join(','),
      };
      getHideFields(newValue);
      if (defaultValues.color) {
        setColor(defaultValues.color);
      }
      if (Object.keys(prevValues || {})?.length > 0 || storageFieldFormValue) {
        reset(newValue);
        cleanPrevValues();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customFieldGroupDetail?.levels, disabled, storageFieldFormValue]),
  );

  const onHandleSubmit = debounce((data: Record<string, any>) => {
    setVisible(true);
    let emptyNum = 0;
    customFieldGroupDetail?.levels?.forEach((level) => {
      level.children.forEach((child) => {
        child.fields.forEach((field) => {
          const fieldValue = field.isSystem ? data?.[field.fieldCode] : data?.[`${field.id}`];
          if (field.required && fieldValue === undefined && !hideFields.includes(field.id)) {
            emptyNum++;
          }
        });
      });
    });

    if (emptyNum > 0) {
      toast.show(`有${emptyNum}个必填项未填，请检查后再保存！`);
      setVisible(false);
    } else {
      const customFieldList = customFieldGroupDetail ? getFieldListByFieldGroupDetail(customFieldGroupDetail) : [];

      const positionCustomFields = getPositionCustomFields({
        customFieldList,
        values: data,
      });

      let systemValues: Record<string, unknown> = {};

      Object.keys(data)
        .filter((item) => isNaN(Number(item)))
        .forEach((item) => {
          systemValues[item] = data[item];
        });

      const {
        id,
        area,
        lnglat,
        color: systemColor,
        group,
        icon,
        positionImages,
        ...restValue
      }: Record<string, any> = systemValues || {};
      const [lng, lat] = lnglat?.split(',') || [];
      const [province, city, district] = area?.split(',') || [];
      const requestData = {
        ...restValue,
        id: id,
        mapId: mapId,
        longitude: lng,
        latitude: lat,
        color: systemColor[0],
        customFieldGroupId: templateId,
        groupId: group?.id,
        icon: icon?.[0]?.url,
        province,
        city,
        district,
        positionImages: positionImages?.map(({ url }: { url: string }) => url),
        positionCustomFields: toArray(positionCustomFields || {}),
      };

      if (onSubmit) {
        onSubmit(requestData)?.then(() => {
          setVisible(false);
          reset();
        });
      }
    }
  }, 1000);

  useEffect(() => {
    const subscription = watch((value) => {
      onValueChange?.(value);
      if (value?.color) {
        setColor(value?.color);
      }
    });
    return () => subscription.unsubscribe();
  }, [onValueChange, watch]);

  const content = (
    <View className="mb-3">
      {customFieldGroupDetail?.levels?.map(({ children, levelId, levelName }) => {
        const childrens = children
          ?.map(({ fields, levelId: twoLevelId, levelName: twoLevelName }, index: number) => {
            const fieldChildrens = fields
              .map((item) => {
                const itemName = `${item.isSystem ? item.fieldCode : item.id}`;
                const show = disabled ? getValues(itemName) !== undefined : true;
                return hideFields.includes(item.id) || !show || (item.isSystem && hideSystemFields) ? undefined : (
                  <View key={item.id}>
                    <Controller
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <FieldFormItem
                          disabled={disabled || disabledFieldTypes?.includes(item.type)}
                          item={item}
                          color={color}
                          onChange={(...e) => {
                            onChange(...e);
                            if ([FieldsTypeEnum.MULTIPLE_CHOICE, FieldsTypeEnum.SINGLE_CHOICE].includes(item.type)) {
                              const values = getValues();
                              getHideFields(values);
                            }
                          }}
                          onPositionChange={() => {
                            setPrevValues(getValues());
                            update('markerLocation');
                            navigation.navigate(ROUTER_FLAG.Home, { screen: 'Home' });
                          }}
                          value={value}
                        />
                      )}
                      name={itemName}
                    />
                  </View>
                );
              })
              .filter(Boolean);
            return (
              !!fieldChildrens?.length && (
                <View key={twoLevelId}>
                  <XStack justifyContent="flex-start">
                    <Text
                      color={primary.DEFAULT}
                      fontSize={12}
                      lineHeight={20}
                      fontWeight={'500'}
                      backgroundColor={primary[100]}
                      paddingHorizontal={12}
                      paddingVertical={8}
                      marginTop={index === 0 ? 12 : 24}
                      borderTopRightRadius={8}
                      borderBottomRightRadius={8}
                    >
                      {twoLevelName}
                    </Text>
                  </XStack>
                  <View className="px-3">{fieldChildrens}</View>
                </View>
              )
            );
          })
          .filter(Boolean);
        return (
          !!childrens?.length && (
            <View key={levelId} className="mb-3">
              <CollapseCard title={levelName}>{childrens}</CollapseCard>
            </View>
          )
        );
      })}
    </View>
  );

  return loading ? (
    <YStack padding="$3" space="$4" alignItems="center">
      <Spinner size="small" color="$green10" />
    </YStack>
  ) : (
    <YStack className="h-full">
      {canScroll ? (
        <ScrollView className="m-3 mb-0 flex-1" showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
      {!disabled && (
        <View className="bg-white p-3">
          <TouchableOpacity
            onPress={() => {
              setVisible(true);
              handleSubmit(onHandleSubmit)();
            }}
          >
            <Button className="h-10 bg-primary">
              <Text color={'white'} fontSize={16} fontWeight={'500'}>
                {buttonText || '保存'}
              </Text>
            </Button>
          </TouchableOpacity>
        </View>
      )}
    </YStack>
  );
};
