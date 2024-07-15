import Svg, { Defs, ClipPath, Rect, G, Path } from 'react-native-svg';

export const Check = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <Defs>
        <ClipPath id="a">
          <Rect width={24} height={24} rx={0} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)">
        <Path
          d="M9.525 15.425L20.132 4.818l1.414 1.414-12.02 12.021-7.072-7.07 1.414-1.415 5.657 5.657z"
          fillRule="evenodd"
          fill={props.color ?? '#3678F2'}
        />
      </G>
    </Svg>
  );
};
