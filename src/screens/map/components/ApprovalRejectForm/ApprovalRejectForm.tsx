import { Controller, useForm } from 'react-hook-form';
import { Button, ScrollView, Text, TextArea, View, XStack, YStack } from 'tamagui';
import { usePosition, usePositionDetail, useService } from '../../hooks';
import { useEffect, useMemo } from 'react';
import { ReasonSheet } from '.';
import colors from '@/src/components/Theme/colors';
import { debounce } from 'lodash-es';

type IProps = {
  onSuccess?: () => void;
};

export const ApprovalRejectForm = ({ onSuccess }: IProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { flowAuditReject } = useService();
  const { detail, getPositionDetail } = usePositionDetail();
  const { positionInfo: markerDetail } = usePosition();

  useEffect(() => {
    if (markerDetail?.id) {
      getPositionDetail({ id: markerDetail.id, type: markerDetail?.positionType });
    }
  }, [getPositionDetail, markerDetail.id, markerDetail?.positionType]);

  const onSubmit = useMemo(
    () =>
      debounce((values: Record<string, any>) => {
        const { description, reason } = values;

        flowAuditReject({
          businessId: detail.id,
          businessType: 'POSITION_ASSESS',
          processInstanceId: detail.processInstanceId,
          reason: reason.join('；'),
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
    [detail.id, detail.processInstanceId, flowAuditReject, onSuccess],
  );

  return (
    <YStack className="h-full bg-white">
      <ScrollView className="mb-0 flex-1" showsVerticalScrollIndicator={false}>
        <View className="m-3">
          <View>
            <XStack alignItems="center" space={4}>
              <Text>不通过原因</Text>
              <Text className="text-red-600">*</Text>
            </XStack>
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => <ReasonSheet onChange={onChange} value={value} />}
              name={'reason'}
            />
            {errors.reason && <Text color={colors.danger.DEFAULT}>请选择不通过原因</Text>}
          </View>
          <View marginTop={12}>
            <XStack alignItems="center" space={4}>
              <Text>审核意见</Text>
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
            {errors.reason && <Text color={colors.danger.DEFAULT}>请输入审核意见</Text>}
          </View>
        </View>
      </ScrollView>

      <View className="bg-white p-3">
        <Button className="h-10 bg-red-500" onPress={handleSubmit(onSubmit)}>
          <Text color={'white'} fontSize={16} fontWeight={'500'}>
            确认不通过
          </Text>
        </Button>
      </View>
    </YStack>
  );
};
