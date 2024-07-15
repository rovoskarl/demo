import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export const AddGroup = (props: any) => {
  const { color = '#00BBB4' } = props;
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={22} height={22} viewBox="0 0 20 20" {...props}>
      <Path
        d="M1.667 10a8.333 8.333 0 1116.666 0 8.333 8.333 0 01-16.666 0zm9.166-3.333v2.5h2.5v1.666h-2.5v2.5H9.167v-2.5h-2.5V9.167h2.5v-2.5h1.666z"
        fillRule="evenodd"
        fill={color}
      />
    </Svg>
  );
};
