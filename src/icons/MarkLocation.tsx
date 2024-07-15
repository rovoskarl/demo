import * as React from 'react';
import Svg, { Defs, LinearGradient, Stop, ClipPath, Rect, G, Path } from 'react-native-svg';

export const MarkLocation = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={65} height={65} viewBox="0 0 65 65" {...props}>
      <Defs>
        <LinearGradient x1={0.5} y1={0} x2={0.5} y2={1} id="b">
          <Stop offset="0%" stopColor="#00F1C5" />
          <Stop offset="100%" stopColor="#00B88D" />
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
          d="M39.697 29.983l-2.895-3.992 2.895-3.995c.316-.437.378-.926.166-1.342-.211-.415-.645-.654-1.188-.654H26.668A1.666 1.666 0 0025 21.66v16.673a.833.833 0 101.667 0V31.98h12.008c.547 0 .982-.24 1.193-.654.21-.412.149-.902-.171-1.343z"
          fill="#FFF"
        />
      </G>
    </Svg>
  );
};
