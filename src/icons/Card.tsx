import Svg, { Defs, ClipPath, Rect, G, Path } from 'react-native-svg';

export function Card(props: any) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <Defs>
        <ClipPath id="a">
          <Rect width={24} height={24} rx={0} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)">
        <Path
          d="M3.5 2.5a1 1 0 00-1 1V10a1 1 0 001 1H10a1 1 0 001-1V3.5a1 1 0 00-1-1H3.5zm1 6.5V4.5H9V9H4.5zM14 2.5a1 1 0 00-1 1V10a1 1 0 001 1h6.5a1 1 0 001-1V3.5a1 1 0 00-1-1H14zM15 9V4.5h4.5V9H15zM2.5 14a1 1 0 011-1H10a1 1 0 011 1v6.5a1 1 0 01-1 1H3.5a1 1 0 01-1-1V14zm2 1v4.5H9V15H4.5zm9.5-2a1 1 0 00-1 1v6.5a1 1 0 001 1h6.5a1 1 0 001-1V14a1 1 0 00-1-1H14zm1 6.5V15h4.5v4.5H15z"
          fillRule="evenodd"
          fill="#86909C"
        />
      </G>
    </Svg>
  );
}
