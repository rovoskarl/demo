import Svg, { Path } from 'react-native-svg';

export const DoubleLeft = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={20} height={20} viewBox="0 0 20 20" {...props}>
      <Path
        d="M15.947 4.714l1.178-1.178 5.304 5.303 5.303-5.303 1.178 1.178-6.481 6.482-6.482-6.482zm0 4.714l1.178-1.178 5.304 5.303 5.303-5.303 1.178 1.178-6.481 6.482-6.482-6.482z"
        fillRule="evenodd"
        fill="#FFF"
        fillOpacity={0.8500000238418579}
        transform="rotate(90 15.947 3.536)"
      />
    </Svg>
  );
};
