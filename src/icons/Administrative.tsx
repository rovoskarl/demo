import * as React from 'react';
import Svg, { Defs, ClipPath, Rect, Ellipse, G, Path } from 'react-native-svg';

export const Administrative = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={48} height={48} viewBox="0 0 48 48" {...props}>
      <Defs>
        <ClipPath id="a">
          <Rect x={11.99993896484375} y={12} width={24} height={24} rx={0} />
        </ClipPath>
      </Defs>
      <Ellipse cx={23.99993896484375} cy={24} rx={24} ry={24} fill="#FFF" />
      <Ellipse cx={23.99993896484375} cy={24} rx={23.75} ry={23.75} stroke="#858585" strokeWidth={0.5} />
      <G clipPath="url(#a)">
        <Path
          d="M27 15l.237-.712a.75.75 0 00-.474 0L27 15zm-6 18l-.237.711a.75.75 0 00.474 0L21 33zm-6-18l.237-.712a.75.75 0 00-.987.712H15zm18 2h.75a.75.75 0 00-.513-.712L33 17zm0 16l-.237.711A.75.75 0 0033.75 33H33zm-18-2h-.75c0 .323.207.61.513.711L15 31zm11.25-16v16h1.5V15h-1.5zm-6 2v16h1.5V17h-1.5zm.987-.712l-6-2-.474 1.424 6 2 .474-1.424zm5.526-2l-6 2 .474 1.424 6-2-.474-1.424zm0 1.424l6 2 .474-1.424-6-2-.474 1.424zM32.25 17v16h1.5V17h-1.5zm.987 15.288l-6-2-.474 1.423 6 2 .474-1.423zm-12 1.423l6-2-.474-1.423-6 2 .474 1.423zm-6.474-2l6 2 .474-1.423-6-2-.474 1.423zM14.25 15v16h1.5V15h-1.5z"
          fill="#5E5E5E"
        />
      </G>
    </Svg>
  );
};
