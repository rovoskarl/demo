import Svg, { Defs, ClipPath, Rect, G, Path } from 'react-native-svg';

export const Folder = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={32} height={32} viewBox="0 0 32 32" {...props}>
      <Defs>
        <ClipPath id="a">
          <Rect width={32} height={32} rx={0} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)">
        <Path
          d="M28.767 27H3.233C2.551 27 2 26.512 2 25.909V8.09C2 7.488 2.551 7 3.233 7h25.534C29.449 7 30 7.488 30 8.091V25.91c0 .6-.554 1.091-1.233 1.091z"
          fill="#FFE9B4"
        />
        <Path d="M16 13H2V6.312C2 5.587 2.551 5 3.233 5h9.582c.545 0 1.024.378 1.18.935L16 13z" fill="#FFB02C" />
        <Path
          d="M28.767 27H3.233C2.551 27 2 26.46 2 25.794V10.206C2 9.54 2.551 9 3.233 9h25.534C29.449 9 30 9.54 30 10.206v15.588c0 .664-.554 1.206-1.233 1.206z"
          fill="#FFCA28"
        />
      </G>
    </Svg>
  );
};
