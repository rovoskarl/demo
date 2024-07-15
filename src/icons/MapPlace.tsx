import * as React from 'react';
import Svg, { Defs, ClipPath, Rect, G, Path } from 'react-native-svg';

export const MapPlace = (props: any) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={16} height={16} viewBox="0 0 16 16" {...props}>
      <Defs>
        <ClipPath id="a">
          <Rect width={16} height={16} rx={0} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)">
        <Path
          d="M3.667 6.802c0-2.485 1.956-4.469 4.333-4.469 2.377 0 4.333 1.984 4.333 4.469 0 .536-.245 1.24-.696 2.048-.443.792-1.041 1.61-1.653 2.359A30.856 30.856 0 018 13.399a30.853 30.853 0 01-1.984-2.19c-.612-.748-1.21-1.567-1.653-2.36-.451-.807-.696-1.51-.696-2.047zm3.876 8.017L8 14.333l.456.486-.456.429-.457-.429zm0 0L8 14.333l.456.486.002-.001.003-.003.012-.011.044-.043a30.908 30.908 0 00.743-.742 32.21 32.21 0 001.756-1.966c.638-.78 1.29-1.667 1.785-2.553.486-.87.866-1.817.866-2.698C13.667 3.614 11.147 1 8 1 4.854 1 2.333 3.614 2.333 6.802c0 .881.38 1.828.866 2.698.495.886 1.147 1.773 1.785 2.553a32.2 32.2 0 002.499 2.708l.02.02.024.022.012.012.003.003.001.001zM7 6.333a1 1 0 112 0 1 1 0 01-2 0zM8 4a2.333 2.333 0 100 4.667A2.333 2.333 0 008 4z"
          fillRule="evenodd"
          fill="#141414"
        />
      </G>
    </Svg>
  );
};
