import Svg, { Path } from 'react-native-svg';

export const Fullscreen = (props: any) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={23.333332061767578}
      height={21}
      viewBox="0 0 23.333332061767578 21"
      {...props}
    >
      <Path
        d="M25.667 2.333h4.083V0h-4.667a1.75 1.75 0 00-1.75 1.75v4.667h2.334V2.333zM40.25 0h4.667c.966 0 1.75.784 1.75 1.75v4.667h-2.334V2.333H40.25V0zM23.333 19.25v-4.667h2.334v4.084h4.083V21h-4.667a1.75 1.75 0 01-1.75-1.75zm21-.583v-4.084h2.334v4.667a1.75 1.75 0 01-1.75 1.75H40.25v-2.333h4.083z"
        fillRule="evenodd"
        fill={props.color ?? '#FFF'}
        transform="matrix(-1 0 0 1 46.667 0)"
      />
    </Svg>
  );
};

export const NonFullScreen = (props: any) => {
  const { color = '#FFF' } = props;
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <Path
        d="M27.417 4.083V0h2.333v4.667A1.75 1.75 0 0128 6.417h-4.667V4.083h4.084zm12.833.584V0h2.333v4.083h4.084v2.334H42a1.75 1.75 0 01-1.75-1.75zm-16.917 9.916H28c.966 0 1.75.784 1.75 1.75V21h-2.333v-4.083h-4.084v-2.334zm19.25 2.334h4.084v-2.334H42a1.75 1.75 0 00-1.75 1.75V21h2.333v-4.083z"
        fillRule="evenodd"
        fill={color}
        transform="matrix(-1 0 0 1 46.667 0)"
      />
    </Svg>
  );
};
