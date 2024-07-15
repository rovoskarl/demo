import { Controller, useForm } from 'react-hook-form';
import { Text, TextArea, View, XStack, YStack } from 'tamagui';
import { useBusinessConfigDetail, usePosition, usePositionDetail, useService } from '../../hooks';
import { useEffect, useMemo } from 'react';
import { FieldsForm, FieldsTypeEnum } from '../FieldsForm';
import { useDependency } from '@/src/ioc';
import colors from '@/src/components/Theme/colors';
import { Toast, ToastToken } from '@/src/interfaces/notifications';
import { debounce } from 'lodash-es';

type IProps = {
  onSuccess?: () => void;
};

export const ApprovalPassForm = ({ onSuccess }: IProps) => {
  const { detail, getPositionDetail } = usePositionDetail();
  const { businessConfigDetail } = useBusinessConfigDetail();
  const { flowAuditApprove } = useService();
  const toast = useDependency<Toast>(ToastToken);
  const { positionInfo: markerDetail } = usePosition();
  useEffect(() => {
    if (markerDetail?.id) {
      getPositionDetail({ id: markerDetail.id, type: markerDetail?.positionType });
    }
  }, [getPositionDetail, markerDetail.id, markerDetail?.positionType]);

  const { control, getValues } = useForm();

  const onHandleSubmit = useMemo(
    () =>
      debounce(async (values: Record<string, any>): Promise<void> => {
        const reason = getValues('reason');
        return new Promise((resolve, reject) => {
          if (!reason) {
            toast.show('审核意见未填，请检查后再保存！');
            reject();
          } else {
            flowAuditApprove({
              businessId: detail?.id,
              processInstanceId: detail?.processInstanceId,
              businessType: 'POSITION_ASSESS',
              fromData: {
                ...values,
                mapId: detail?.mapId,
                id: detail?.id,
              },
              reason,
            })
              .then(() => {
                onSuccess?.();
                resolve();
              })
              .catch((error) => {
                if (error?.response?.data?.code === 605) {
                  onSuccess?.();
                } else {
                  reject(error);
                }
              });
          }
        });
      }, 1000),
    [detail?.id, detail?.mapId, detail?.processInstanceId, flowAuditApprove, getValues, onSuccess, toast],
  );

  return (
    <YStack className="h-full bg-white">
      <View>
        <View className="m-3">
          <View marginTop={12}>
            <XStack alignItems="center" space={4}>
              <Text>审核意见</Text>
              <Text className="text-red-600">*</Text>
            </XStack>
            <Controller
              control={control}
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
              name={'reason'}
            />
          </View>
        </View>
        <View padding={12} width={'100%'} backgroundColor={colors.bgColor.DEFAULT}>
          <Text>钉图入库补充信息</Text>
        </View>
      </View>
      <View flex={1}>
        {!!businessConfigDetail?.templateId && (
          <FieldsForm
            buttonText="确认通过"
            isEdit
            data={detail}
            disabledFieldTypes={[FieldsTypeEnum.LOCATION, FieldsTypeEnum.ADDRESS, FieldsTypeEnum.AREA]}
            templateId={businessConfigDetail?.templateId}
            onSubmit={onHandleSubmit}
          />
        )}
      </View>
    </YStack>
  );
};
