import React, { FC } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';

export const Header: FC<{
  title?: string;
  subTitle?: string;
  children?: React.ReactNode;
  top?: number;
  left?: number;
}> = ({ title, subTitle, children, top = 100, left = 16 }) => {
  return (
    <XStack height={220}>
      <ImageBackground
        style={[styles.header, { paddingTop: top, paddingHorizontal: left }]}
        source={require('@/src/assets/images/bg.png')}
      >
        <YStack width="100%">
          {children ? (
            children
          ) : (
            <>
              <Text fontSize={24} fontWeight="500" color="$black8Light">
                {title}
              </Text>
              <Text fontSize={14} marginTop={14} fontWeight="400" color="$black8Light">
                {subTitle}
              </Text>
            </>
          )}
        </YStack>
      </ImageBackground>
    </XStack>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
  },
});
