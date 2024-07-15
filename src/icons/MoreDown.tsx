import Svg, { Defs, ClipPath, Rect, G, Path } from 'react-native-svg';

export function MoreDown(props: any) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={16} height={16} viewBox="0 0 16 16" {...props}>
      <Defs>
        <ClipPath id="a">
          <Rect width={16} height={16} rx={0} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)">
        <Path
          d="M13.671 6.286h1.334v6.667h6.666v1.333h-7.333v-.667.667h-.667v-8z"
          fillRule="evenodd"
          fill="#858585"
          transform="scale(-1 1) rotate(-45 0 39.292)"
        />
      </G>
    </Svg>
  );
}
