import { SafeAreaView } from 'react-native';
import { MapScreen } from '../map';

export function HomeScreen() {
  return (
    <SafeAreaView className="flex-1">
      <MapScreen />
    </SafeAreaView>
  );
}
