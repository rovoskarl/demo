import { View, YStack } from 'tamagui';
import { FieldFormItem, FieldsForm, FieldsTypeEnum } from '../../map/components';
import { TCollectedTaskDetail } from '../types';
import { CollapseCard } from '@/src/components';
import { ScrollView } from 'react-native-gesture-handler';

type IProps = {
  detail: TCollectedTaskDetail;
};

export const TaskFieldsDetailInfo = ({ detail }: IProps) => {
  const taskFields = [
    { id: 1, fieldCode: 'taskName', fieldName: '任务名称', type: FieldsTypeEnum.TEXT },
    { id: 2, fieldCode: 'description', fieldName: '任务描述', type: FieldsTypeEnum.TEXT },
    { id: 3, fieldCode: 'beginDate', fieldName: '开始时间', type: FieldsTypeEnum.TEXT },
    { id: 4, fieldCode: 'endDate', fieldName: '截止时间', type: FieldsTypeEnum.TEXT },
    { id: 5, fieldCode: 'address', fieldName: '任务地点', type: FieldsTypeEnum.TEXT },
    { id: 6, fieldCode: 'ownerUserName', fieldName: '负责人', type: FieldsTypeEnum.TEXT },
  ];

  return (
    <YStack className="h-full">
      <ScrollView className="m-3 mb-0 flex-1" showsVerticalScrollIndicator={false}>
        <View className="mb-3">
          <CollapseCard title={'任务名称'}>
            {taskFields.map((item) => {
              return (
                <View className="px-3" key={item.id}>
                  <FieldFormItem disabled item={item} value={detail[item.fieldCode as keyof TCollectedTaskDetail]} />
                </View>
              );
            })}
          </CollapseCard>
        </View>
        <FieldsForm
          isEdit={true}
          data={{ fieldValues: detail.extraFields }}
          templateId={detail.fieldGroupId}
          disabled
          hideSystemFields
          canScroll={false}
        />
      </ScrollView>
    </YStack>
  );
};
