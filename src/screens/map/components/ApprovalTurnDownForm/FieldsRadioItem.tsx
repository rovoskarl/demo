import { Text, View, XStack } from 'tamagui';
import { FieldFormItem, FieldTitle, TCustomFieldGroupDetail } from '..';
import { useState } from 'react';
import { Check } from '@/src/icons';
import { danger } from '@/src/components/Theme/colors';
import { Control, Controller, FieldValues } from 'react-hook-form';
import { TextInput } from 'react-native';

type IProps = {
  info: Record<string, any>;
  control: Control<FieldValues, any>;
  field: TCustomFieldGroupDetail['levels'][0]['children'][0]['fields'][0];
};

export const FieldsRadioItem = ({ info, field, control }: IProps) => {
  const [checked, setChecked] = useState(false);
  return (
    <XStack onPress={() => setChecked(!checked)} width={'100%'}>
      <View>
        {checked ? (
          <View backgroundColor={danger.DEFAULT} borderRadius={20} width={20} height={20} padding={2}>
            <Check color="#fff" width="16" height="16" />
          </View>
        ) : (
          <View
            backgroundColor={'white'}
            borderWidth={1}
            borderColor={'#DCDCDC'}
            borderRadius={20}
            width={20}
            height={20}
            padding={2}
          />
        )}
      </View>
      <View marginLeft={12} flex={1}>
        <FieldTitle description={field.description} fieldName={field.fieldName} />

        <FieldFormItem
          item={field}
          disabled
          onlyShowContent
          color={info?.color}
          value={info[`${field.isSystem ? field.fieldCode : field.id}`]}
        />
        {checked && (
          <Controller
            rules={{ required: true }}
            control={control}
            render={({ field: { value, onChange } }) => (
              <View borderBottomColor={'#F0F0F0'} borderBottomWidth={0.5}>
                <XStack alignItems="center" space={4}>
                  <Text>错误说明</Text>
                  <Text className="text-red-600">*</Text>
                </XStack>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  className="border-0 bg-white p-0 mt-1 rounded-none"
                  placeholderTextColor={'#b8b8b8'}
                  placeholder={'请输入'}
                />
              </View>
            )}
            name={field.fieldName}
          />
        )}
      </View>
    </XStack>
  );
};
