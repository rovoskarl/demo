import * as React from 'react';
import Svg, { Ellipse, Path, G } from 'react-native-svg';

export const StandardMap = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={48} height={48} viewBox="0 0 48 48" {...props}>
      <Ellipse cx={23.99993896484375} cy={24} rx={24} ry={24} fill="#FFF" />
      <Ellipse cx={23.99993896484375} cy={24} rx={23.75} ry={23.75} stroke="#858585" strokeWidth={0.5} />
      <G>
        <Path
          d="M15 23l-.286-.694a.75.75 0 00-.01 1.383L15 23zm17-7l.693.286a.75.75 0 00-.979-.98L32 16zm-7 17l-.69.295a.75.75 0 001.383-.01L25 33zm-9.714-9.306l17-7-.572-1.388-17 7 .572 1.388zm16.02-7.98l-7 17 1.387.572 7-17-1.387-.572zm-5.617 16.99l-3-7-1.378.591 3 7 1.378-.59zm-3.394-7.393l-7-3-.59 1.378 7 3 .59-1.378zm9.175-9.841l-10 10 1.06 1.06 10-10-1.06-1.06z"
          fill="#5E5E5E"
        />
      </G>
    </Svg>
  );
};
