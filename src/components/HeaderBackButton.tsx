import { FC } from 'react';
import { Back } from '@/src/icons/Back';
import { TouchableOpacity, TouchableWithoutFeedbackProps } from 'react-native';

export const HeaderBackButton: FC<TouchableWithoutFeedbackProps> = (props) => {
  return (
    <TouchableOpacity {...props}>
      <Back />
    </TouchableOpacity>
  );
};
