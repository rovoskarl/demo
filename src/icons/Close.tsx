import * as React from 'react';
import Svg, { Defs, ClipPath, Rect, G, Path } from 'react-native-svg';

export const Close = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={20} height={20} viewBox="0 0 20 20" {...props}>
      <Defs>
        <ClipPath id="a">
          <Rect width={20} height={20} rx={0} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)">
        <Path
          d="M8.821 10L3.518 4.697l1.179-1.179L10 8.821l5.303-5.303 1.179 1.179L11.179 10l5.303 5.303-1.179 1.179L10 11.179l-5.303 5.303-1.179-1.179L8.821 10z"
          fillRule="evenodd"
          fill="#858585"
        />
      </G>
    </Svg>
  );
};
