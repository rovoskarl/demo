import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export const Delete = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={16} height={16} viewBox="0 0 16 16" {...props}>
      <Path
        d="M11.333 3V1.667H4.667V3h-3v1.333h1.166v9a1 1 0 001 1h8.334a1 1 0 001-1v-9h1.166V3h-3zM4.167 13V4.333h7.666V13H4.167zM6 6v5h1.333V6H6zm2.667 0v5H10V6H8.667z"
        fillRule="evenodd"
        fill="#858585"
      />
    </Svg>
  );
};
