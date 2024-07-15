import { StatusBar, StatusBarStyle, ColorValue } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

interface Props {
  animated?: boolean;
  translucent?: boolean;
  barStyle?: StatusBarStyle | null;
  backgroundColor?: ColorValue;
}

export function FocusStatusBar({ barStyle, backgroundColor, translucent, animated }: Props) {
  const isFocused = useIsFocused();
  return isFocused ? (
    <StatusBar translucent={translucent} barStyle={barStyle} backgroundColor={backgroundColor} animated={animated} />
  ) : null;
}
