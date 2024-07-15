import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export const CircleSuccess = (props: any) => {
  const { color = '#FFF' } = props;
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={40} height={40} viewBox="0 0 40 40" {...props}>
      <Path
        d="M29.217 15.884a1.25 1.25 0 00-1.767-1.768l1.767 1.768zm-12.55 10.783l-.884.884a1.25 1.25 0 001.768 0l-.884-.884zm-4.117-5.884a1.25 1.25 0 10-1.767 1.767l1.767-1.767zm14.9-6.667L15.783 25.783l1.768 1.767 11.666-11.666-1.767-1.768zM10.782 22.55l5 5 1.768-1.767-5-5-1.768 1.767zM33.75 20c0 7.594-6.156 13.75-13.75 13.75v2.5c8.975 0 16.25-7.275 16.25-16.25h-2.5zM20 33.75c-7.594 0-13.75-6.156-13.75-13.75h-2.5c0 8.975 7.275 16.25 16.25 16.25v-2.5zM6.25 20c0-7.594 6.156-13.75 13.75-13.75v-2.5C11.025 3.75 3.75 11.025 3.75 20h2.5zM20 6.25c7.594 0 13.75 6.156 13.75 13.75h2.5c0-8.975-7.275-16.25-16.25-16.25v2.5z"
        fill={color}
      />
    </Svg>
  );
};
