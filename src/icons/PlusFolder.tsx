import * as React from 'react';
import Svg, { Defs, ClipPath, Rect, G, Path } from 'react-native-svg';

export const PlusFolder = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={48} height={48} viewBox="0 0 48 48" {...props}>
      <Defs>
        <ClipPath id="a">
          <Rect x={12} y={12} width={24} height={24} rx={0} />
        </ClipPath>
      </Defs>
      <Rect width={48} height={48} rx={8} fill="#FF7D00" fillOpacity={0.05000000074505806} />
      <G clipPath="url(#a)">
        <Path
          d="M33.575 32.25h-19.15c-.512 0-.925-.366-.925-.818V18.068c0-.452.413-.818.925-.818h19.15c.512 0 .925.366.925.818v13.364c0 .45-.416.818-.925.818z"
          fill="#FFE9B4"
        />
        <Path d="M24 21.75H13.5v-5.016c0-.544.413-.984.925-.984h7.186c.409 0 .768.283.885.7L24 21.75z" fill="#FFB02C" />
        <Path
          d="M33.575 32.25h-19.15a.914.914 0 01-.925-.905v-11.69c0-.5.413-.905.925-.905h19.15c.512 0 .925.404.925.905v11.69a.917.917 0 01-.925.905z"
          fill="#FFCA28"
        />
      </G>
    </Svg>
  );
};
