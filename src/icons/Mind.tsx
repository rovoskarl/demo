import Svg, { Path } from 'react-native-svg';

export function Mind(props: any) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={19} height={17} viewBox="0 0 19 17" {...props}>
      <Path
        d="M0 2a2 2 0 113 1.732V8h2.5v2H3v5h2.5v2H1V3.732A2 2 0 010 2zm19 1H7.5V1H19v2zm0 7H7.5V8H19v2zm0 7H7.5v-2H19v2z"
        fillRule="evenodd"
        fill="#000"
        fillOpacity={0.8500000238418579}
      />
    </Svg>
  );
}
