import { XStack } from 'tamagui';
import { colors } from '../constant/constants';
import { TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Check } from '@/src/icons';
import { useCallback } from 'react';

export const Colors = ({
  isSingle = false,
  value,
  onChange,
}: {
  isSingle?: boolean;
  value: number[];
  onChange: (value: number[]) => void;
}) => {
  const chooseColor = useCallback(
    (item: any) => {
      if (isSingle) {
        onChange([item.key]);
      } else {
        onChange(value.includes(item.key) ? value.filter((key) => key !== item.key) : [...value, item.key]);
      }
    },
    [isSingle, onChange, value],
  );
  return (
    <XStack marginVertical={isSingle ? 0 : 0} space="$2" justifyContent="space-between">
      {colors.map((item) => {
        return (
          <TouchableOpacity
            key={item.key}
            onPress={() => {
              chooseColor(item);
            }}
          >
            <LinearGradient
              style={{
                width: isSingle ? 20 : 24,
                height: isSingle ? 20 : 24,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              colors={item.colors}
            >
              {value.includes(item.key) ? <Check color="#ffffff" width="18" height="14" /> : null}
            </LinearGradient>
          </TouchableOpacity>
        );
      })}
    </XStack>
  );
};
