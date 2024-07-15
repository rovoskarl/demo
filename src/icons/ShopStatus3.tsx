import * as React from 'react';
import Svg, { Defs, ClipPath, Rect, G, Path } from 'react-native-svg';

export const ShopStatus3 = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={16} height={16} viewBox="0 0 16 16" {...props}>
      <Defs>
        <ClipPath id="a">
          <Rect width={16} height={16} rx={0} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)">
        <Path
          d="M8 2.667a5.333 5.333 0 100 10.666A5.333 5.333 0 008 2.667zM1.333 8a6.667 6.667 0 1113.334 0A6.667 6.667 0 011.333 8zm6-3.333h1.334v2.666h2.5v1.334H7.333v-4z"
          fillRule="evenodd"
          fill="#3491FA"
        />
      </G>
    </Svg>
  );
};
