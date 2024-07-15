import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export function ExclamationMark(props: any) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={13} height={13} viewBox="0 0 13 13" {...props}>
      <Path
        d="M6 3.173a.5.5 0 001 0H6zm1-.006a.5.5 0 00-1 0h1zM6 9.833a.5.5 0 101 0H6zm1-4.666a.5.5 0 10-1 0h1zm0-1.994v-.006H6v.006h1zm0 6.66V5.167H6v4.666h1zM12 6.5A5.5 5.5 0 016.5 12v1A6.5 6.5 0 0013 6.5h-1zM6.5 12A5.5 5.5 0 011 6.5H0A6.5 6.5 0 006.5 13v-1zM1 6.5A5.5 5.5 0 016.5 1V0A6.5 6.5 0 000 6.5h1zM6.5 1A5.5 5.5 0 0112 6.5h1A6.5 6.5 0 006.5 0v1z"
        fill="#141414"
      />
    </Svg>
  );
}
