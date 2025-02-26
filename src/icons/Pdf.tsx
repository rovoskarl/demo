import * as React from 'react';
import Svg, { Defs, ClipPath, Rect, G, Path } from 'react-native-svg';

export const Pdf = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={32} height={32} viewBox="0 0 32 32" {...props}>
      <Defs>
        <ClipPath id="a">
          <Rect width={32} height={32} rx={0} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)">
        <Path
          d="M5 1c-.375 0-.775.15-1.05.45-.275.3-.45.675-.45 1.05v27c0 .375.15.775.45 1.05.3.3.675.45 1.05.45h22c.375 0 .775-.15 1.05-.45.3-.3.45-.675.45-1.05v-20L20 1H5z"
          fill="#FF5562"
        />
        <Path d="M28.5 9.5h-7a1.44 1.44 0 01-1.05-.45A1.44 1.44 0 0120 8V1l8.5 8.5z" fill="#FFBBC0" />
        <Path
          d="M21.75 26.349c-1.575 0-2.975-2.7-3.725-4.45-1.25-.525-2.625-1-3.95-1.325C12.9 21.35 10.925 22.5 9.4 22.5c-.95 0-1.625-.475-1.875-1.3-.2-.675-.025-1.15.175-1.4.4-.55 1.225-.825 2.475-.825 1 0 2.275.175 3.7.525.925-.65 1.85-1.4 2.675-2.2-.375-1.75-.775-4.575.25-5.875.5-.625 1.275-.825 2.2-.55 1.025.3 1.4.925 1.525 1.4.425 1.7-1.525 4-2.85 5.35.3 1.175.675 2.4 1.15 3.525 1.9.85 4.15 2.1 4.4 3.475.1.475-.05.925-.425 1.3-.325.275-.675.425-1.05.425zm-2.325-3.8c.95 1.925 1.85 2.825 2.325 2.825.075 0 .175-.025.325-.15.175-.175.175-.3.15-.4-.1-.5-.9-1.325-2.8-2.275zm-9.25-2.575c-1.225 0-1.575.3-1.675.425-.025.05-.125.175-.025.525.075.3.275.6.925.6.8 0 1.95-.45 3.3-1.25-.975-.2-1.825-.3-2.525-.3zm4.95-.15c.8.225 1.625.5 2.4.8-.275-.725-.5-1.475-.7-2.2-.55.475-1.125.95-1.7 1.4zm3.1-8.075c-.275 0-.475.1-.65.3-.525.65-.575 2.3-.175 4.4 1.525-1.625 2.35-3.125 2.15-3.925-.025-.125-.125-.475-.825-.675-.2-.075-.35-.1-.5-.1z"
          fill="#FFF"
        />
      </G>
    </Svg>
  );
};
