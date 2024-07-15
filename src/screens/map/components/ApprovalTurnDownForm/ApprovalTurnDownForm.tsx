import { Controller, useForm } from 'react-hook-form';
import { Button, ScrollView, Spinner, Text, TextArea, View, XStack, YStack, debounce } from 'tamagui';
import { useCustomFieldGroupDetail, usePosition, usePositionDetail, useService } from '../../hooks';
import { useEffect, useMemo } from 'react';
import { CustomFieldGroupIdEnum, TCustomFieldGroupDetail, positionCustomFieldsReappearance } from '../FieldsForm';
import { flatMapDeep } from 'lodash-es';
import { FieldsRadioItem } from '.';
import colors from '@/src/components/Theme/colors';

type IProps = {
  onSuccess?: () => void;
};

export const ApprovalTurnDownForm = ({ onSuccess }: IProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { flowAuditTurn } = useService();
  const { detail, getPositionDetail } = usePositionDetail();
  const { customFieldGroupDetail, loading }: { customFieldGroupDetail: TCustomFieldGroupDetail; loading: boolean } =
    useCustomFieldGroupDetail(CustomFieldGroupIdEnum.PinMapCollectionInfo);
  const { positionInfo: markerDetail } = usePosition();
  useEffect(() => {
    if (markerDetail?.id) {
      getPositionDetail({ id: markerDetail.id, type: markerDetail?.positionType });
    }
  }, [getPositionDetail, markerDetail.id, markerDetail?.positionType]);

  const initFieldValues = useMemo(() => {
    const data = { ...(detail || {}), ...(detail?.shopPosition || {}) };
    const {
      color,
      icon,
      groupName,
      groupId,
      longitude: lng,
      latitude: lat,
      cityname,
      adname,
      pname,
      province,
      city,
      district,
      fieldValues,
      positionImages,
      imageList,
      images,
      ...restDetail
    } = data || {};
    const positionCustomFields = positionCustomFieldsReappearance(fieldValues || []);
    const formValue = {
      ...restDetail,
      ...positionCustomFields,
      color: color ? [color] : [1],
      icon: icon ? [{ url: icon }] : undefined,
      lnglat: [lng, lat].join(','),
      area: [province || pname, city || cityname, district || adname].join(','),
      group: {
        name: groupName,
        id: groupId,
      },
      positionImages: positionImages ? positionImages.map((item: string) => ({ url: item })) : undefined,
      imageList: imageList ? imageList.map((item: string) => ({ url: item })) : undefined,
      images: images ? images.map((item: string) => ({ url: item })) : undefined,
    };
    return formValue;
  }, [detail]);

  const infoList = flatMapDeep(
    customFieldGroupDetail?.levels?.map((level) => level.children.map((child) => child.fields)) || [],
  ).filter((item) => Object.keys(initFieldValues).includes(`${item.isSystem ? item.fieldCode : item.id}`));

  const onSubmit = useMemo(
    () =>
      debounce((values: Record<string, any>) => {
        const { description, ...restValues } = values;

        flowAuditTurn({
          processInstanceId: detail.processInstanceId,
          remark: JSON.stringify(restValues),
          description,
        })
          .then(() => {
            onSuccess?.();
          })
          .catch((error) => {
            if (error?.response?.data?.code === 605) {
              onSuccess?.();
            }
          });
      }, 1000),
    [detail.processInstanceId, flowAuditTurn, onSuccess],
  );

  return loading ? (
    <YStack padding="$3" space="$4" alignItems="center">
      <Spinner size="small" color="$green10" />
    </YStack>
  ) : (
    <YStack className="h-full bg-white">
      <ScrollView className="mb-0 flex-1" showsVerticalScrollIndicator={false}>
        <View className="m-3">
          <View marginTop={12}>
            <XStack alignItems="center" space={4}>
              <Text>驳回审核意见</Text>
              <Text className="text-red-600">*</Text>
            </XStack>
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <TextArea
                  value={value}
                  onChangeText={onChange}
                  className="border-0 bg-white p-0 mt-1 rounded-none"
                  placeholderTextColor={'#b8b8b8'}
                  placeholder={'请输入'}
                  maxLength={255}
                />
              )}
              name={'description'}
            />
            {errors.description && <Text color={colors.danger.DEFAULT}>请输入驳回审核意见</Text>}
          </View>
        </View>
        <View padding={12} width={'100%'} backgroundColor={colors.bgColor.DEFAULT}>
          <Text>请选择有误信息</Text>
        </View>
        <View className="m-3">
          {infoList.map((field) => (
            <View className="mt-3">
              <FieldsRadioItem control={control} info={initFieldValues} field={field} key={field.id} />

              {errors[field.fieldName] && <Text color={colors.danger.DEFAULT}>请输入{field.fieldName}有误说明</Text>}
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="bg-white p-3">
        <Button className="h-10 bg-red-500" onPress={handleSubmit(onSubmit)}>
          <Text color={'white'} fontSize={16} fontWeight={'500'}>
            确认驳回
          </Text>
        </Button>
      </View>
    </YStack>
  );
};
