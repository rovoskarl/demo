import * as React from 'react';
import Svg, { Defs, ClipPath, Rect, G, Path } from 'react-native-svg';

export const Add = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={16} height={16} viewBox="0 0 16 16" {...props}>
      <Defs>
        <ClipPath id="a">
          <Rect width={16} height={16} rx={0} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)">
        <Path
          d="M7.333 7.333V1.667h1.334v5.666h5.666v1.334H8.667v5.666H7.333V8.667H1.667V7.333h5.666z"
          fillRule="evenodd"
          fill={props?.color ? props.color : "#858585"}
        />
      </G>
    </Svg>
  );
};
