import * as React from 'react';
import Svg, { Defs, ClipPath, Rect, Ellipse, G, Path } from 'react-native-svg';

export const ShowName = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={48} height={48} viewBox="0 0 48 48" {...props}>
      <Defs>
        <ClipPath id="a">
          <Rect x={11.99993896484375} y={12} width={24} height={24} rx={0} />
        </ClipPath>
      </Defs>
      <Ellipse cx={23.99993896484375} cy={24} rx={24} ry={24} fill="#FFF" />
      <Ellipse cx={23.99993896484375} cy={24} rx={23.75} ry={23.75} stroke="#858585" strokeWidth={0.5} />
      <G clipPath="url(#a)">
        <Path
          d="M28.5 26l.53-.53a.75.75 0 00-.53-.22V26zm3.5 3.5l-.53.53a.75.75 0 001.28-.53H32zM18.5 26l.53-.53a.75.75 0 00-.53-.22V26zm3.5 3.5l-.53.53a.75.75 0 001.28-.53H22zm6.5-4.25a2.75 2.75 0 01-2.75-2.75h-1.5a4.25 4.25 0 004.25 4.25v-1.5zm-2.75-2.75a2.75 2.75 0 012.75-2.75v-1.5a4.25 4.25 0 00-4.25 4.25h1.5zm2.75-2.75a2.75 2.75 0 012.75 2.75h1.5a4.25 4.25 0 00-4.25-4.25v1.5zm-.53 6.78l3.5 3.5 1.06-1.06-3.5-3.5-1.06 1.06zm4.78 2.97v-7h-1.5v7h1.5zM18.5 25.25a2.75 2.75 0 01-2.75-2.75h-1.5a4.25 4.25 0 004.25 4.25v-1.5zm-2.75-2.75a2.75 2.75 0 012.75-2.75v-1.5a4.25 4.25 0 00-4.25 4.25h1.5zm2.75-2.75a2.75 2.75 0 012.75 2.75h1.5a4.25 4.25 0 00-4.25-4.25v1.5zm-.53 6.78l3.5 3.5 1.06-1.06-3.5-3.5-1.06 1.06zm4.78 2.97v-7h-1.5v7h1.5z"
          fill="#5E5E5E"
        />
      </G>
    </Svg>
  );
};
