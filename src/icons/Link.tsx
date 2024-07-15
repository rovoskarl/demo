import * as React from 'react';
import Svg, { Defs, ClipPath, Rect, G, Path } from 'react-native-svg';

export const Link = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={20} height={20} viewBox="0 0 20 20" {...props}>
      <Defs>
        <ClipPath id="a">
          <Rect width={20} height={20} rx={0} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)">
        <Path
          d="M4.2 16.086a1.667 1.667 0 000 3.333h5c.92 0 1.666-.746 1.666-1.666h1.667A3.333 3.333 0 019.2 21.086h-5a3.333 3.333 0 110-6.667h2.916v1.667H4.2zm4.166 1.667a3.333 3.333 0 013.334-3.334h5a3.333 3.333 0 110 6.667h-2.917V19.42H16.7a1.667 1.667 0 100-3.333h-5c-.92 0-1.667.746-1.667 1.667H8.366z"
          fillRule="evenodd"
          fill="#B8B8B8"
          transform="rotate(-45 .866 14.42)"
        />
      </G>
    </Svg>
  );
};
