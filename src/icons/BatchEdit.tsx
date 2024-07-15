import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export const BatchEdit = (props: any) => {
  const { color = '#141414' } = props;
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <Path
        d="M17 3l.53-.53a.75.75 0 00-1.06 0L17 3zm4 4l.53.53a.75.75 0 000-1.06L21 7zm-9 9v.75a.75.75 0 00.53-.22L12 16zm-4 0h-.75c0 .414.336.75.75.75V16zm0-4l-.53-.53a.75.75 0 00-.22.53H8zm12 8v.75a.75.75 0 00.75-.75H20zM4 20h-.75c0 .414.336.75.75.75V20zM4 4v-.75a.75.75 0 00-.75.75H4zm6 .75a.75.75 0 100-1.5v1.5zM20.75 14a.75.75 0 00-1.5 0h1.5zM16.47 3.53l4 4 1.06-1.06-4-4-1.06 1.06zM12 15.25H8v1.5h4v-1.5zM8.75 16v-4h-1.5v4h1.5zm-.22-3.47l6-6-1.06-1.06-6 6 1.06 1.06zm6-6l3-3-1.06-1.06-3 3 1.06 1.06zm5.94-.06l-3 3 1.06 1.06 3-3-1.06-1.06zm-3 3l-6 6 1.06 1.06 6-6-1.06-1.06zm1.06 0l-4-4-1.06 1.06 4 4 1.06-1.06zM20 19.25H4v1.5h16v-1.5zM4.75 20V4h-1.5v16h1.5zM4 4.75h6v-1.5H4v1.5zM19.25 14v6h1.5v-6h-1.5z"
        fill={color}
      />
    </Svg>
  );
};
