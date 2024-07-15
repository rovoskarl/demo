import * as React from 'react';
import Svg, { Defs, ClipPath, Rect, G, Path } from 'react-native-svg';

export function RollBack(props: any) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <Defs>
        <ClipPath id="a">
          <Rect width={24} height={24} rx={0} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)">
        <Path
          d="M33.729 15.2a7 7 0 106.78 8.75l1.936.5a9 9 0 11-1.716-7.906v-2.344h2v6h-6v-2h2.745a6.993 6.993 0 00-5.745-3z"
          fillRule="evenodd"
          fill="#FFF"
          fillOpacity={0.8500000238418579}
          transform="scale(-1 1) rotate(-45 0 72.9)"
        />
        <Path
          d="M7.752 16h3.76v-1.152H10.44V10.04H9.392c-.416.264-.832.424-1.472.544v.88h1.096v3.384H7.752V16zm6.688.112c1.256 0 2.104-1.072 2.104-3.12 0-2.04-.848-3.056-2.104-3.056-1.256 0-2.112 1.008-2.112 3.056s.856 3.12 2.112 3.12zm0-1.104c-.424 0-.768-.384-.768-2.016 0-1.624.344-1.968.768-1.968.424 0 .76.344.76 1.968 0 1.632-.336 2.016-.76 2.016z"
          fill="#FFF"
          fillOpacity={0.8500000238418579}
        />
      </G>
    </Svg>
  );
}

export function RightRollBack(props: any) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <Defs>
        <ClipPath id="a">
          <Rect width={24} height={24} rx={0} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)">
        <Path
          d="M8.272 15.2a7 7 0 106.78 8.75l1.937.5c-1 3.88-4.522 6.75-8.717 6.75a9 9 0 117-14.657V14.2h2v6h-6v-2h2.746a6.993 6.993 0 00-5.746-3z"
          fillRule="evenodd"
          fill="#FFF"
          fillOpacity={0.8500000238418579}
          transform="rotate(-45 -.728 13.2)"
        />
        <Path
          d="M7.752 16h3.76v-1.152H10.44V10.04H9.392c-.416.264-.832.424-1.472.544v.88h1.096v3.384H7.752V16zm6.688.112c1.256 0 2.104-1.072 2.104-3.12 0-2.04-.848-3.056-2.104-3.056-1.256 0-2.112 1.008-2.112 3.056s.856 3.12 2.112 3.12zm0-1.104c-.424 0-.768-.384-.768-2.016 0-1.624.344-1.968.768-1.968.424 0 .76.344.76 1.968 0 1.632-.336 2.016-.76 2.016z"
          fill="#FFF"
          fillOpacity={0.8500000238418579}
        />
      </G>
    </Svg>
  );
}
