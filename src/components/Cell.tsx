import { Text, TextProps, XStack, YStack } from 'tamagui';
import { TouchableOpacity } from 'react-native';
import { FunctionComponent } from 'react';

type ListItemIconProps = { color?: string; size?: number };
type IconProp = JSX.Element | FunctionComponent<ListItemIconProps> | null;

type Props = {
  title: string;
  subTitle?: string;
  iconBefore?: IconProp;
  iconAfter?: IconProp;
  onClick?: () => void;
  activeOpacity?: number | undefined;
  backgroundColor?: string;
  titleStyle?: TextProps;
  subTitleStyle?: TextProps;
  bottomDivider?: boolean;
};

export const Cell: React.FC<Props> = ({
  backgroundColor,
  title,
  iconBefore,
  iconAfter,
  onClick,
  activeOpacity = 0.8,
  subTitleStyle,
  titleStyle,
  subTitle,
  bottomDivider = true,
}) => {
  return (
    <TouchableOpacity activeOpacity={activeOpacity} onPress={onClick}>
      <XStack
        paddingVertical="$3.5"
        alignItems="center"
        justifyContent="space-between"
        borderBottomWidth={bottomDivider ? '$0.25' : '$0'}
        borderBottomColor="#F2F3F5"
        backgroundColor={backgroundColor}
      >
        <XStack flex={1} space="$3.5" alignItems="center" justifyContent="flex-start">
          {iconBefore}
          <YStack space="$1.5">
            <Text {...titleStyle} fontSize={16} fontWeight="400" color="$black8Light">
              {title}
            </Text>
            {subTitle && (
              <Text {...subTitleStyle} fontSize={12} fontWeight="400" color="rgba(0,0,0,0.45)">
                {subTitle}
              </Text>
            )}
          </YStack>
        </XStack>
        {iconAfter}
      </XStack>
    </TouchableOpacity>
  );
};
