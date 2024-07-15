import { FC } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { XStack, YStack, Text } from 'tamagui';

interface ListItemProps {
  title?: string;
  subTitle?: string;
  iconBefore?: any;
  iconAfter?: string | (() => JSX.Element) | JSX.Element;
  onPress?: () => void;
}

export const ListItem: FC<ListItemProps> = ({ title, subTitle, iconAfter, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <XStack
        marginHorizontal="$3.5"
        paddingVertical="$3.5"
        borderBottomWidth={0.5}
        borderBottomColor="#F2F3F5"
        justifyContent="space-between"
      >
        <YStack space={8}>
          <Text fontSize={16} color="$black8Light" fontWeight="400">
            {title}
          </Text>
          {subTitle ? (
            <Text fontSize={12} color="rgba(0,0,0,0.45)" fontWeight="400">
              {subTitle}
            </Text>
          ) : null}
        </YStack>
        {typeof iconAfter === 'string' ? (
          <Text fontSize={16} fontWeight="400" color="$primaryLight">
            {iconAfter}
          </Text>
        ) : (
          iconAfter
        )}
      </XStack>
    </TouchableWithoutFeedback>
  );
};
