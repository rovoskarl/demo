import Svg, { Path } from 'react-native-svg';

export const Video = (props: any) => {
  const { color = '#333' } = props;
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={23.91650390625}
      height={17.5}
      viewBox="0 0 23.91650390625 17.5"
      {...props}
    >
      <Path
        d="M1.75 0A1.75 1.75 0 000 1.75v14c0 .966.783 1.75 1.75 1.75h14.583a1.75 1.75 0 001.75-1.75v-1.932l3.58 1.074a1.75 1.75 0 002.254-1.676V4.284a1.75 1.75 0 00-2.253-1.676l-3.58 1.074V1.75A1.75 1.75 0 0016.333 0H1.75zm2.3 7.05h3.5V4.717h-3.5V7.05z"
        fillRule="evenodd"
        fill={color}
      />
    </Svg>
  );
};
