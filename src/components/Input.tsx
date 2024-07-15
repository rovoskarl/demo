import { FC } from 'react';
import { XStack, Input as TextInput, YStack, Stack, InputProps, Text } from 'tamagui';

export const Input: FC<
  InputProps & {
    icon?: React.JSX.Element;
    inputBorderColor?: string;
    errorText?: string;
    children?: React.ReactNode;
  }
> = ({
  children,
  icon,
  inputBorderColor = '#E5E6EB',
  errorText,
  marginHorizontal = '$6',
  paddingHorizontal,
  backgroundColor,
  ...props
}) => {
  return (
    <YStack
      marginHorizontal={marginHorizontal}
      paddingHorizontal={paddingHorizontal}
      backgroundColor={backgroundColor}
      space="$3.5"
    >
      <XStack
        width="100%"
        height="$4.5"
        borderBottomWidth={0.5}
        borderBottomColor={errorText ? '#F53F3F' : inputBorderColor}
      >
        <XStack flex={1} alignItems="center" height="$4.5">
          <Stack width={20} height={20} alignItems="center" justifyContent="center">
            {icon}
          </Stack>
          <TextInput
            keyboardType="numeric"
            flex={1}
            borderRadius="$0"
            paddingLeft={12}
            borderColor="$white"
            backgroundColor="$white"
            placeholderTextColor="$black2Light"
            color="$black8Light"
            fontSize={16}
            fontWeight="500"
            {...props}
          />
        </XStack>
        {children}
      </XStack>
      {errorText && (
        <Text animation="100ms" fontSize={14} fontWeight="400" color="#F53F3F">
          {errorText}
        </Text>
      )}
    </YStack>
  );
};
