import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export const Image = (props: any) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={22.16650390625}
      height={22.16668701171875}
      viewBox="0 0 22.16650390625 22.16668701171875"
      {...props}
    >
      <Path
        d="M0 2.333A2.333 2.333 0 012.333 0h17.5a2.333 2.333 0 012.334 2.333v17.5a2.333 2.333 0 01-2.334 2.334h-17.5A2.333 2.333 0 010 19.833v-17.5zM4.65 4.65h3.5v3.5h-3.5v-3.5zm12.834 3.6v9.233H4.598l4.427-5.692 2.151 2.766 6.308-6.307z"
        fillRule="evenodd"
        fill={props.color ?? '#333'}
      />
    </Svg>
  );
};
