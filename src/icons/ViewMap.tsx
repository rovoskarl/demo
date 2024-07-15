import * as React from 'react';
import Svg, { Defs, Mask, Rect, Ellipse, G, Path } from 'react-native-svg';

export const ViewMap = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={40} height={40} viewBox="0 0 40 40" {...props}>
      <Defs>
        <Mask id="a" maskUnits="userSpaceOnUse">
          <Rect width={40} height={40} rx={0} fill="#FFF" />
        </Mask>
        <Mask id="b" maskUnits="userSpaceOnUse">
          <Ellipse cx={25.27197265625} cy={15.95458984375} rx={18} ry={18} fill="#FFF" />
        </Mask>
        <Mask id="c" maskUnits="userSpaceOnUse">
          <Ellipse cx={25.27197265625} cy={15.95458984375} rx={18} ry={18} fill="#FFF" />
        </Mask>
      </Defs>
      <G mask="url(#a)">
        <G transform="rotate(15 7.272 -2.045)" mask="url(#b)">
          <Ellipse cx={25.27197265625} cy={15.95458984375} rx={18} ry={18} fill="#EDEAE1" />
          <Ellipse cx={25.27197265625} cy={15.95458984375} rx={19} ry={19} stroke="#FFF" strokeWidth={2} />
          <G transform="rotate(15 7.272 -2.045)" mask="url(#c)">
            <Ellipse cx={25.27197265625} cy={15.95458984375} rx={18} ry={18} fill="#EDEAE1" />
            <Rect x={7.27197265625} y={18.95458984375} width={43} height={5} rx={0} fill="#FFF" />
            <Rect
              x={18.27197265625}
              y={23.95458984375}
              width={26}
              height={5}
              rx={0}
              fill="#FFF"
              transform="matrix(0 -1 1 0 -5.682 42.226)"
            />
            <Rect
              x={27.27197265625}
              y={33.95458984375}
              width={10}
              height={5}
              rx={0}
              fill="#FFF"
              transform="matrix(0 -1 1 0 -6.682 61.226)"
            />
            <Rect
              x={7.27197265625}
              y={33.95458984375}
              width={10}
              height={20}
              rx={0}
              fill="#A6CCFD"
              transform="matrix(0 -1 1 0 -26.682 41.227)"
            />
            <Rect
              x={32.27197265625}
              y={33.95458984375}
              width={10}
              height={11}
              rx={0}
              fill="#CEE998"
              transform="matrix(0 -1 1 0 -1.682 66.226)"
            />
          </G>
        </G>
        <Path
          d="M29.03 1.814c-4.97 0-9.035 4.16-9.035 9.244q0 5.085 7.115 12.943c1.13 1.271 2.823 1.271 3.953 0q7.114-7.742 7.114-12.943c0-2.426-.903-4.853-2.597-6.586-1.92-1.734-4.179-2.658-6.55-2.658z"
          fill="#00BBB4"
        />
        <Ellipse
          cx={29.08630657196045}
          cy={10.90465259552002}
          rx={4.13223123550415}
          ry={4.132231712341309}
          fill="#FFF"
        />
      </G>
    </Svg>
  );
};
