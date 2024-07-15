import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export const CheckCircle = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <Path
        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12z"
        fillRule="evenodd"
        fill="#00BBB4"
      />
      <Path
        d="M17.407 9.407l-6.457 6.457-4.207-4.207 1.414-1.414 2.793 2.793 5.043-5.043 1.414 1.414z"
        fillRule="evenodd"
        fill="#FFF"
      />
    </Svg>
  );
};
