import React, { FC } from 'react';
import { Dimensions } from 'react-native';
import { YStack } from 'tamagui';

interface EmptyProps {
  children?: React.ReactNode;
}

const { height } = Dimensions.get('screen');

export const Empty: FC<EmptyProps> = ({ children }) => {
  return (
    <YStack height={height / 1.5} justifyContent="center" alignItems="center">
      {children}
    </YStack>
  );
};
