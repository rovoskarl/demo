import Svg, { Path } from 'react-native-svg';

export function Interactive(props: any) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <Path
        d="M4.5 7h-2V5h2v2zm17 0h-15V5h15v2zm-17 6h-2v-2h2v2zm17 0h-15v-2h15v2zm-17 6h-2v-2h2v2zm17 0h-15v-2h15v2z"
        fillRule="evenodd"
        fill={props.color ?? '#000'}
        fillOpacity={0.8500000238418579}
      />
    </Svg>
  );
}
