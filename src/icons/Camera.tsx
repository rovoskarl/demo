import Svg, { Ellipse, Rect } from 'react-native-svg';

export function Camera(props: any) {
  const { color = '#86909C' } = props;
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <Ellipse cx={12} cy={10} rx={8} ry={8} stroke={color} strokeWidth={2} />
      <Ellipse cx={12} cy={10} rx={3} ry={3} stroke={color} strokeWidth={2} />
      <Rect x={7} y={20} width={10} height={2} rx={0} fill={color} />
    </Svg>
  );
}
