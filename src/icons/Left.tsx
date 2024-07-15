import Svg, { Path } from 'react-native-svg';

export function Left(props: any) {
  const { color = '#000' } = props;
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <Path
        d="M8.485 0h2v10h10v2h-11v-1 1h-1V0z"
        fillRule="evenodd"
        fill={color}
        fillOpacity={0.8500000238418579}
        transform="rotate(45 8.485 0)"
      />
    </Svg>
  );
}

export function ChevronLeft(props: any) {
  const { color = 'rgba(0,0,0,0.85)' } = props;

  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={11} height={11} viewBox="0 0 11 11" {...props}>
      <Path
        d="M5.657 0H6.99v6.667h6.667V8H6.324v-.667V8h-.667V0z"
        fillRule="evenodd"
        fill={color}
        fillOpacity={0.8500000238418579}
        transform="rotate(45 5.657 0)"
      />
    </Svg>
  );
}
