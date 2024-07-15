import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';

export const CloseCircle = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={20} height={20} viewBox="0 0 20 20" {...props}>
      <G opacity={0.699999988079071}>
        <Path d="M1.667 10a8.333 8.333 0 1116.666 0 8.333 8.333 0 01-16.666 0z" fillRule="evenodd" fill={props?.color ? props?.color : "#141414"} />
        <Path
          d="M6.72 7.899L8.783 9.96 6.72 12.024 7.9 13.202 9.96 11.14l2.063 2.062 1.178-1.178L11.14 9.96 13.202 7.9 12.024 6.72 9.96 8.783 7.9 6.72 6.72 7.9z"
          fillRule="evenodd"
          fill="#FFF"
        />
      </G>
    </Svg>
  );
};
