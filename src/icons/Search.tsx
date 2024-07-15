import Svg, { Path } from 'react-native-svg';

export const Search = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <Path
        d="M13.95 4.05a7 7 0 10-9.9 9.9 7 7 0 009.9-9.9zM2.636 2.636a9 9 0 0113.396 11.982l3.575 3.574-1.415 1.415-3.574-3.575A9.001 9.001 0 012.636 2.636z"
        fillRule="evenodd"
        fill={props.color ?? '#86909C'}
      />
    </Svg>
  );
};
