import Svg, { Path } from 'react-native-svg';

export const Pause = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <Path
        d="M11.667 2.333a9.333 9.333 0 100 18.667 9.333 9.333 0 000-18.667zM0 11.667C0 5.223 5.223 0 11.667 0c6.443 0 11.666 5.223 11.666 11.667 0 6.443-5.223 11.666-11.666 11.666C5.223 23.333 0 18.11 0 11.667zm7.583-4.084H10.5v8.167H7.583V7.583zm5.25 0h2.917v8.167h-2.917V7.583z"
        fillRule="evenodd"
        fill="#FFF"
      />
    </Svg>
  );
};
