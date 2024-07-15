import * as React from 'react';
import Svg, { Defs, ClipPath, Rect, G, Ellipse, Path } from 'react-native-svg';

export const BatchNavigate = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={20} height={20} viewBox="0 0 20 20" {...props}>
      <Defs>
        <ClipPath id="a">
          <Rect width={20} height={20} rx={0} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)">
        <Ellipse cx={10} cy={10} rx={10} ry={10} fill="#FFF" />
        <Ellipse cx={10} cy={10} rx={9.75} ry={9.75} stroke="#B8B8B8" strokeWidth={0.5} />
        <G>
          <Path
            d="M3.5 9.33a.5.5 0 00.303.463l4.483 1.921 1.921 4.483a.5.5 0 00.922-.007l4.667-11.333a.5.5 0 00-.653-.653L3.81 8.871a.5.5 0 00-.31.459z"
            fill="#5E5E5E"
          />
        </G>
      </G>
    </Svg>
  );
};
