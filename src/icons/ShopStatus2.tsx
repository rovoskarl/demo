import * as React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

export const ShopStatus2 = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={16} height={16} viewBox="0 0 16 16" {...props}>
      <Defs>
        <ClipPath id="a">
          <Rect width={16} height={16} rx={0} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)">
        <Path
          d="M1.433 7.649C3.276 4.676 5.453 3 8 3c2.547 0 4.724 1.676 6.567 4.649l.217.351-.217.351C12.724 11.324 10.547 13 8 13c-2.547 0-4.724-1.676-6.567-4.649L1.216 8l.217-.351zM2.79 8c1.671 2.555 3.418 3.667 5.21 3.667 1.792 0 3.539-1.112 5.21-3.667C11.539 5.445 9.792 4.333 8 4.333 6.208 4.333 4.461 5.445 2.79 8zM8 7a1 1 0 100 2 1 1 0 000-2zM5.667 8a2.333 2.333 0 114.666 0 2.333 2.333 0 01-4.666 0z"
          fillRule="evenodd"
          fill="#4E5969"
        />
      </G>
    </Svg>
  );
};
