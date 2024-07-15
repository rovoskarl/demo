import Svg, { Path } from 'react-native-svg';

export const Right = (props: any) => {
  const { color = '#C9CDD4' } = props;
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={14} height={14} viewBox="0 0 14 14" {...props}>
      <Path
        d="M7.071 14.142h1.667v8.333h8.333v1.667H7.904v-.833.833h-.833v-10z"
        fillRule="evenodd"
        fill={color}
        transform="rotate(-135 7.071 14.142)"
      />
    </Svg>
  );
};
