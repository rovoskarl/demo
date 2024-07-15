import Svg, { Rect, Ellipse } from 'react-native-svg';

export function StopRecord(props: any) {
  const { color = '#F53F3F' } = props;
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <Rect x={8} y={8} width={8} height={8} rx={2} fill={color} />
      <Ellipse cx={12} cy={12} rx={11} ry={11} stroke="#F53F3F" strokeWidth={2} />
    </Svg>
  );
}
