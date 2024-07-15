import * as React from 'react';
import Svg, { Defs, LinearGradient, Stop, ClipPath, Rect, G, Path } from 'react-native-svg';

export const History = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={65} height={65} viewBox="0 0 65 65" {...props}>
      <Defs>
        <LinearGradient x1={0.5} y1={0} x2={0.5} y2={1} id="b">
          <Stop offset="0%" stopColor="#66D2FE" />
          <Stop offset="100%" stopColor="#457EF4" />
        </LinearGradient>
        <ClipPath id="c">
          <Rect
            x={19.166666984558105}
            y={15.833170413970947}
            width={26.666667938232422}
            height={26.66666603088379}
            rx={0}
          />
        </ClipPath>
      </Defs>
      <G filter="url(#a)">
        <Path
          d="M52.5 29.167c0 14.727-5.272 20-20 20s-20-5.273-20-20c0-14.728 5.272-20 20-20s20 5.272 20 20z"
          fill="url(#b)"
        />
      </G>
      <G clipPath="url(#c)">
        <Path
          d="M39.996 19.583h-3.33v-.416a.833.833 0 10-1.666 0v.416h-5v-.416a.833.833 0 00-1.667 0v.416h-3.34c-.915 0-1.66.782-1.66 1.743v2.424h18.334v-2.424c0-.961-.75-1.743-1.671-1.743zm-4.163 9.167a.833.833 0 010 1.666h-6.666a.833.833 0 010-1.666h6.666zm-7.5 5c0-.46.374-.834.834-.834h6.666a.833.833 0 010 1.667h-6.666a.833.833 0 01-.834-.833zm12.5-8.333h-17.5V37.84c0 .96.745 1.742 1.66 1.742h15.014c.915 0 1.66-.782 1.66-1.742V25.417h-.834z"
          fill="#FFF"
        />
      </G>
    </Svg>
  );
};
