import Svg, { Defs, ClipPath, Rect, G, Path } from 'react-native-svg';

export const Phone = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={20} height={20} viewBox="0 0 20 20" {...props}>
      <Defs>
        <ClipPath id="a">
          <Rect width={20} height={20} rx={0} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)">
        <Path
          d="M13.75 1.25a4.167 4.167 0 014.167 4.167V15a4.167 4.167 0 01-4.167 4.167h-7.5A4.167 4.167 0 012.083 15V5.417A4.167 4.167 0 016.25 1.25h7.5zm0 1.458h-7.5A2.708 2.708 0 003.543 5.32l-.001.097V15a2.708 2.708 0 002.611 2.707l.097.001h7.5a2.708 2.708 0 002.707-2.61l.001-.098V5.417a2.708 2.708 0 00-2.61-2.707l-.098-.002z"
          fill="#86909C"
        />
        <Path
          d="M12.083 14.27a.73.73 0 01.06 1.457l-.06.002H7.917a.73.73 0 01-.06-1.456l.06-.002h4.166z"
          fill="#86909C"
        />
      </G>
    </Svg>
  );
};
