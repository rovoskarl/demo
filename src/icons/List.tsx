import * as React from 'react';
import Svg, { Defs, ClipPath, Rect, G, Path } from 'react-native-svg';

export const List = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={28} height={28} viewBox="0 0 28 28" {...props}>
      <Defs>
        <ClipPath id="a">
          <Rect width={28} height={28} rx={0} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)">
        <Path
          d="M9.333 8.458a.875.875 0 100 1.75v-1.75zm12.834 1.75a.875.875 0 100-1.75v1.75zM9.333 13.125a.875.875 0 100 1.75v-1.75zm12.834 1.75a.875.875 0 100-1.75v1.75zM9.333 17.792a.875.875 0 100 1.75v-1.75zm12.834 1.75a.875.875 0 100-1.75v1.75zM6.708 9.333a.875.875 0 10-1.75 0h1.75zm-1.75.012a.875.875 0 101.75 0h-1.75zM6.708 14a.875.875 0 10-1.75 0h1.75zm-1.75.012a.875.875 0 101.75 0h-1.75zm1.75 4.655a.875.875 0 00-1.75 0h1.75zm-1.75.011a.875.875 0 001.75 0h-1.75zm4.375-8.47h12.834v-1.75H9.333v1.75zm0 4.667h12.834v-1.75H9.333v1.75zm0 4.667h12.834v-1.75H9.333v1.75zM4.958 9.333v.012h1.75v-.012h-1.75zm0 4.667v.012h1.75V14h-1.75zm0 4.667v.011h1.75v-.011h-1.75z"
          fill="#141414"
        />
      </G>
    </Svg>
  );
};
