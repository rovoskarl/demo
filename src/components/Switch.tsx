import { useEffect, useMemo, useState } from 'react';
import { XStack, Text, Circle, styled } from 'tamagui';
import { Success } from '@/src/icons';
import { TouchableOpacity } from 'react-native';
import { SizeVariantSpreadFunction } from '@tamagui/web';
import { SizableStackProps } from '@tamagui/stacks';

export const getIconSize: SizeVariantSpreadFunction<SizableStackProps> = (size, { tokens }) => {
  const width = tokens.size[size] ?? size;
  const height = tokens.size[size] ?? size;
  return {
    width,
    height,
    minWidth: width,
    maxWidth: width,
    maxHeight: height,
    minHeight: height,
  };
};

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  children?: React.ReactNode | string;
  size?: 'small' | 'default' | 'large';
}

const SwitchIcon = styled(Success, {
  name: 'SwitchIcon',
  color: '$color',
  variants: {
    size: {
      // @ts-ignore
      '...size': getIconSize,
      // @ts-ignore
      ':number': getIconSize,
    },
  } as const,
});

export const Switch: React.FC<SwitchProps> = ({ size = 'default', checked = false, onChange, children }) => {
  const [isActive, setActive] = useState(checked);

  useEffect(() => {
    setActive(checked);
  }, [checked]);

  const onChangeCheck = () => {
    setActive(!isActive);
    onChange && onChange(!isActive);
  };

  const circleSize = useMemo(() => {
    switch (size) {
      case 'small':
        return '$0.85';
      case 'large':
        return '$1.5';
      case 'default':
        return '$1';
    }
  }, [size]);

  const iconWidth = useMemo(() => {
    switch (size) {
      case 'small':
        return '$0.75';
      case 'large':
        return '$0.85';
      default:
        return 10;
    }
  }, [size]);

  const iconHeight = useMemo(() => {
    switch (size) {
      case 'small':
        return 6;
      case 'large':
        return 10;
      default:
        return 7;
    }
  }, [size]);

  return (
    <XStack alignItems="center">
      <TouchableOpacity onPress={onChangeCheck} activeOpacity={0.8}>
        <Circle
          width={circleSize}
          height={circleSize}
          backgroundColor={isActive ? '$primaryLight' : 'transparent'}
          borderWidth={isActive ? 0 : 1}
          borderColor={isActive ? '$primaryLight' : '#cacdd4'}
        >
          <SwitchIcon width={iconWidth} height={iconHeight} color={isActive ? '$white' : 'transparent'} />
        </Circle>
      </TouchableOpacity>
      {typeof children === 'string' ? (
        <Text color="$black8Light" marginLeft="$1.5">
          {children}
        </Text>
      ) : (
        children
      )}
    </XStack>
  );
};
