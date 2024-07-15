import React, { useState, ReactNode } from 'react';
import { XStack, Text } from 'tamagui';

const tagColors = [
  { backgroundColor: '#00BBB4', color: '#ffffff' },
  { backgroundColor: '#3491FA', color: '#ffffff' },
  { backgroundColor: '#B8B8B8', color: '#ffffff' },
  { backgroundColor: '#F7F8FA', color: '#4E5969' },
  { backgroundColor: '#FF7D00', color: '#FF7D00' },
];

export const Tag = ({
  children,
  icon,
  afterIcon,
  type = 1,
}: {
  children: ReactNode;
  icon?: ReactNode;
  afterIcon?: ReactNode;
  type?: 1 | 2 | 3 | 4 | 5;
}) => {
  const [textWidth, setTextWidth] = useState(0);
  const colors = tagColors[type - 1];

  return (
    <XStack
      style={{ minWidth: textWidth, maxWidth: 200 }}
      backgroundColor={colors.backgroundColor}
      borderRadius="$2"
      padding={4}
      alignItems="center"
    >
      {icon ? icon : null}
      <Text onLayout={(event) => setTextWidth(event.nativeEvent.layout.width)} color={colors.color} fontSize={12}>
        {children}
      </Text>
      {afterIcon ? afterIcon : null}
    </XStack>
  );
};
