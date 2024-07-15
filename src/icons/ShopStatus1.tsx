import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export const ShopStatus1 = (props: any) => {
  const { color = '#00BBB4' } = props;
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={16} height={16} viewBox="0 0 16 16" {...props}>
      <Path
        d="M8 2.667a5.333 5.333 0 100 10.666A5.333 5.333 0 008 2.667zM1.333 8a6.667 6.667 0 1113.334 0A6.667 6.667 0 011.333 8zm10.305-1.695L7.333 10.61 4.53 7.805l.942-.943 1.862 1.862 3.362-3.362.943.943z"
        fillRule="evenodd"
        fill={color}
      />
    </Svg>
  );
};
