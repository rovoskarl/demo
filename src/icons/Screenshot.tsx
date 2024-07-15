import Svg, { Path } from 'react-native-svg';

export const Screenshot = (props: any) => {
  const { color = '#333' } = props;

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={23.33349609375}
      height={21}
      viewBox="0 0 23.33349609375 21"
      {...props}
    >
      <Path
        d="M7.764 0C7.21 0 6.706.312 6.459.806l-.763 1.527H1.75A1.75 1.75 0 000 4.083V19.25C0 20.216.784 21 1.75 21h19.833a1.75 1.75 0 001.75-1.75V4.083a1.75 1.75 0 00-1.75-1.75h-3.945L16.874.806A1.458 1.458 0 0015.57 0H7.764zm3.869 6.417a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5zm-2.917 5.25a2.917 2.917 0 115.834 0 2.917 2.917 0 01-5.834 0z"
        fillRule="evenodd"
        fill={color}
      />
    </Svg>
  );
};
