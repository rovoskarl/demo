import React, { forwardRef } from 'react';
import Svg, { Path } from 'react-native-svg';

export const Success = forwardRef((props: any, ref) => {
  const { color = '#4E5969', width = 10, height = 7 } = props.style;
  return (
    <Svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={width}
      height={height}
      viewBox="0 0 10.664205551147461 7.871299743652344"
      {...props}
    >
      <Path
        d="M10.664 1.414L4.207 7.871 0 3.664 1.414 2.25l2.793 2.793L9.25 0l1.414 1.414z"
        fillRule="evenodd"
        fill={color}
      />
    </Svg>
  );
});
