import Svg, { Defs, ClipPath, Rect, G, Path } from 'react-native-svg';

export const Code = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={20} height={20} viewBox="0 0 20 20" {...props}>
      <Defs>
        <ClipPath id="a">
          <Rect width={20} height={20} rx={0} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)">
        <Path
          d="M14.917 1a2.5 2.5 0 012.5 2.5v13.252a1.25 1.25 0 01-1.875 1.083l-5.213-3.009a.833.833 0 00-.816-.01L3.85 17.909A1.25 1.25 0 012 16.81V3.5A2.5 2.5 0 014.5 1h10.417zm0 1.458H4.5c-.549 0-1.004.426-1.04.974l-.002.068v12.96l5.357-2.924a2.292 2.292 0 012.148-.025l.095.052 4.9 2.828V3.5c0-.549-.425-1.004-.973-1.04l-.068-.002z"
          fill="#86909C"
        />
        <Path
          d="M9.917 5a2.917 2.917 0 110 5.833 2.917 2.917 0 010-5.833zm0 1.458a1.458 1.458 0 100 2.917 1.458 1.458 0 000-2.917z"
          fill="#86909C"
        />
      </G>
    </Svg>
  );
};
