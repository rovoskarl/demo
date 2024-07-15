import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export const DrawLine = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <Path
        d="M11.25 21a.75.75 0 001.5 0h-1.5zm0-8v8h1.5v-8h-1.5zm5-5A4.25 4.25 0 0112 12.25v1.5A5.75 5.75 0 0017.75 8h-1.5zM12 12.25A4.25 4.25 0 017.75 8h-1.5A5.75 5.75 0 0012 13.75v-1.5zM7.75 8A4.25 4.25 0 0112 3.75v-1.5A5.75 5.75 0 006.25 8h1.5zM12 3.75A4.25 4.25 0 0116.25 8h1.5A5.75 5.75 0 0012 2.25v1.5z"
        fill="#FFF"
      />
    </Svg>
  );
};
