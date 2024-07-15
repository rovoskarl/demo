import * as React from 'react';
import Svg, { Defs, LinearGradient, Stop, ClipPath, Rect, G, Path } from 'react-native-svg';

export const Acquisition = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={65} height={65} viewBox="0 0 65 65" {...props}>
      <Defs>
        <LinearGradient x1={0.5} y1={0} x2={0.5} y2={1} id="b">
          <Stop offset="0%" stopColor="#FFB066" />
          <Stop offset="100%" stopColor="#F95C21" />
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
          d="M37.717 32.916a5.852 5.852 0 01-5.052 2.917 5.855 5.855 0 01-5.053-2.917.833.833 0 111.441-.833 4.187 4.187 0 003.612 2.083 4.18 4.18 0 003.608-2.083.833.833 0 111.444.833zm2.29-10.416H24.993c-.916 0-1.659.743-1.66 1.66v13.344c0 .917.745 1.662 1.66 1.662h15.014a1.663 1.663 0 001.66-1.661V24.16c-.001-.917-.744-1.66-1.66-1.661zM32.5 20c1.378 0 2.5 1.122 2.5 2.5h1.667a4.171 4.171 0 00-4.167-4.167 4.171 4.171 0 00-4.167 4.167H30c0-1.378 1.122-2.5 2.5-2.5z"
          fill="#FFF"
        />
      </G>
    </Svg>
  );
};
