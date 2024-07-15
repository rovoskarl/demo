import Svg, { Path } from 'react-native-svg';

export function Down(props: any) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={7.352757453918457}
      height={4.819768905639648}
      viewBox="0 0 7.352757453918457 4.819768905639648"
      {...props}
    >
      <Path
        d="M3.91 4.707a.3.3 0 01-.468 0L.066.487A.3.3 0 01.301 0h6.751a.3.3 0 01.234.487l-3.375 4.22z"
        fill={props?.color ?? '#000'}
        fillOpacity={0.8500000238418579}
      />
    </Svg>
  );
}
