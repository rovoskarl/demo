import * as React from 'react';
import Svg, { Defs, ClipPath, Rect, G, Path } from 'react-native-svg';

export const More = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={20} height={20} viewBox="0 0 20 20" {...props}>
      <Defs>
        <ClipPath id="a">
          <Rect width={20} height={20} rx={0} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)">
        <Path
          d="M11.25 2.5h-2.5V5h2.5V2.5zm0 6.25h-2.5v2.5h2.5v-2.5zm0 6.25h-2.5v2.5h2.5V15z"
          fillRule="evenodd"
          fill={props?.color ? props.color : "#141414"}
        />
      </G>
    </Svg>
  );
};
