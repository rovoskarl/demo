import React from 'react';
import { Input, InputProps } from 'tamagui';

type IProps = Omit<InputProps, 'onChange'> & {
  value: string;
  onChange: (value: string) => void;
};

export const InputFormItem = ({ value, onChange, ...restProps }: IProps) => {
  const [text, setText] = React.useState(value);

  return <Input {...restProps} value={text} onChangeText={setText} onBlur={() => onChange(text)} />;
};
