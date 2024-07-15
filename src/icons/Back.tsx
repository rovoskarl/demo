import Svg, { Defs, ClipPath, Rect, G, Path } from 'react-native-svg';

export function Back(props: any) {
  return (
    <Svg fill="none" width={28} height={28} viewBox="0 0 24 24">
      <Defs>
        <ClipPath id="a">
          <Rect width={24} height={24} rx={0} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)">
        <Path
          d="M15.293 3.493h2v10h10v2h-11v-1 1h-1v-12z"
          fillRule="evenodd"
          fill={props.color ?? '#000'}
          fillOpacity={0.8500000238418579}
          transform="rotate(45 15.293 3.493)"
        />
      </G>
    </Svg>
  );
}
