import { FC } from 'react';
import { Button, ButtonProps } from 'tamagui';

export const NextButton: FC<ButtonProps & { title?: string }> = (props) => {
  const { title = '下一步' } = props;
  return (
    <Button
      backgroundColor={props.disabled ? '#86E8DD' : '$primaryLight'}
      color="$white"
      fontSize={16}
      fontWeight="500"
      marginHorizontal="$6"
      borderRadius="$3.5"
      height="$4.5"
      marginTop="$7.5"
      {...props}
    >
      {title}
    </Button>
  );
};
