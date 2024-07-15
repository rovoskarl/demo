import * as React from 'react';
import Svg, { Defs, ClipPath, Rect, G, Path } from 'react-native-svg';

export const BatchMove = (props: any) => {
  const { color = '#141414' } = props;
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <Defs>
        <ClipPath id="a">
          <Rect width={24} height={24} rx={0} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)">
        <Path
          d="M15 3.25a.75.75 0 000 1.5v-1.5zM18 4v0zm2 2h-.75.75zm0 12h0zm-2 2v0zm-3-.75a.75.75 0 000 1.5v-1.5zm-4.53-3.78a.75.75 0 101.06 1.06l-1.06-1.06zM15 12l.53.53a.75.75 0 000-1.06L15 12zm-3.47-4.53a.75.75 0 00-1.06 1.06l1.06-1.06zM3 11.25a.75.75 0 000 1.5v-1.5zm12-6.5h3v-1.5h-3v1.5zM19.25 6v12h1.5V6h-1.5zM18 19.25h-3v1.5h3v-1.5zM19.25 18c0 .69-.56 1.25-1.25 1.25v1.5A2.75 2.75 0 0020.75 18h-1.5zM18 4.75c.69 0 1.25.56 1.25 1.25h1.5A2.75 2.75 0 0018 3.25v1.5zm-6.47 11.78l4-4-1.06-1.06-4 4 1.06 1.06zm4-5.06l-4-4-1.06 1.06 4 4 1.06-1.06zm-.53-.22H3v1.5h12v-1.5z"
          fill={color}
        />
      </G>
    </Svg>
  );
};
