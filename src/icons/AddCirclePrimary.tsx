import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export const AddCirclePrimary = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <Path
        d="M12 4a8 8 0 100 16 8 8 0 000-16zM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12zm11-1V8h-2v3H8v2h3v3h2v-3h3v-2h-3z"
        fillRule="evenodd"
        fill="#00BBB4"
      />
    </Svg>
  );
};
