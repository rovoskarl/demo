import { padEnd } from 'lodash-es';
import { FC, useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { YStack, Input, Stack, XStack, Text } from 'tamagui';

interface VerificationCodeProps {
  codeLength?: number;
  onChangeText: (text: string) => void;
  value?: string;
}

export const VerificationCode: FC<VerificationCodeProps> = ({ onChangeText, codeLength = 4 }) => {
  const textInput = useRef<TextInput>(null);
  const [value, setValue] = useState('');

  const renderCode = () => {
    const paddedCode = padEnd(value, codeLength, ' ');
    const codeArray = paddedCode.split('');
    return (
      <XStack alignItems="center" justifyContent="center" space="$5">
        {codeArray.map((code, index) => (
          <YStack
            key={index}
            width={60}
            height={60}
            backgroundColor="#F5F5F5"
            borderRadius="$3.5"
            alignItems="center"
            justifyContent="center"
            position="relative"
          >
            {code !== ' ' ? (
              <Text fontSize={32} fontWeight="500" color="#3D3D3D">
                {code}
              </Text>
            ) : (
              <Stack position="absolute" top={30} width="$2.5" height={1} backgroundColor="#141414" />
            )}
          </YStack>
        ))}
      </XStack>
    );
  };

  return (
    <YStack position="relative" marginHorizontal="$6">
      {renderCode()}
      <Input
        ref={textInput}
        underlineColorAndroid="transparent"
        caretHidden
        autoFocus
        keyboardType={'numeric'}
        padding="$0"
        backgroundColor="transparent"
        borderColor="transparent"
        position="absolute"
        top={0}
        width="100%"
        height="100%"
        maxLength={codeLength}
        color="transparent"
        onChangeText={(text) => {
          const reg = /^[0-9]*$/;
          if (reg.test(text)) {
            setValue(text);
            onChangeText?.(text);
          }
        }}
        value={value}
      />
    </YStack>
  );
};
