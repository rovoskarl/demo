import * as React from 'react';
import Svg, { Defs, ClipPath, Rect, G, Path } from 'react-native-svg';

export const ShopStatus4 = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={16} height={16} viewBox="0 0 16 16" {...props}>
      <Defs>
        <ClipPath id="a">
          <Rect width={16} height={16} rx={0} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)">
        <Path
          d="M8 2.667a5.333 5.333 0 100 10.666A5.333 5.333 0 008 2.667zM1.333 8a6.667 6.667 0 1113.334 0A6.667 6.667 0 011.333 8zm5.726.002l-1.65-1.65.943-.942 1.65 1.65 1.65-1.65.943.943-1.65 1.65 1.65 1.65-.943.942-1.65-1.65-1.65 1.65-.942-.943 1.65-1.65z"
          fillRule="evenodd"
          fill="#4E5969"
        />
      </G>
    </Svg>
  );
};
