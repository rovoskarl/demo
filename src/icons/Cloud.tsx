import Svg, { Path } from 'react-native-svg';

export function Cloud(props: any) {
  const { color = '#86909C' } = props;
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={13.852133750915527}
      height={12.656867027282715}
      viewBox="0 0 13.852133750915527 12.656867027282715"
      {...props}
    >
      <Path
        d="M4 5.333l.001.616-.594.065a2.334 2.334 0 00.26 4.653H8V12H3.667a3.667 3.667 0 01-.973-7.203C2.972 2.086 5.335 0 8.167 0c3.015 0 5.5 2.366 5.5 5.333h-1.334c0-2.187-1.843-4-4.166-4-2.324 0-4.167 1.813-4.167 4zm6.357 4.771V6.667h1.333v3.438l1.22-1.22.942.943-2.828 2.829-2.829-2.829.943-.942 1.219 1.218z"
        fillRule="evenodd"
        fill={color}
      />
    </Svg>
  );
}

export function SD(props: any) {
  const { color = '#86909C' } = props;

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={12}
      height={13.333333015441895}
      viewBox="0 0 12 13.333333015441895"
      {...props}
    >
      <Path
        d="M1.333 1.333V12h9.334V3.92l-2.3-2.587H8v4.334a1 1 0 01-1 1H3a1 1 0 01-1-1V1.333h-.667zM1 0a1 1 0 00-1 1v11.333a1 1 0 001 1h10a1 1 0 001-1v-8.54a1 1 0 00-.253-.664L9.264.336A1 1 0 008.517 0H1zm2.333 1.333v4h1V3h1.334v2.333h1v-4H3.333z"
        fillRule="evenodd"
        fill={color}
      />
    </Svg>
  );
}
