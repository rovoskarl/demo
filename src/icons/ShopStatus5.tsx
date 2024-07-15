import * as React from 'react';
import Svg, { Defs, ClipPath, Rect, G, Path } from 'react-native-svg';

export const ShopStatus5 = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={16} height={16} viewBox="0 0 16 16" {...props}>
      <Defs>
        <ClipPath id="a">
          <Rect width={16} height={16} rx={0} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)">
        <Path
          d="M1.667 8a6.333 6.333 0 0112.666 0v.21a6.124 6.124 0 01-6.123 6.123H1.667V8zM8 3a5 5 0 00-5 5v5h5.21A4.79 4.79 0 0013 8.21V8a5 5 0 00-5-5zm3 3v1.333H5V6h6zm-3 4.333H5V9h3v1.333z"
          fillRule="evenodd"
          fill="#FF7D00"
        />
      </G>
    </Svg>
  );
};
