import { SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ROUTER_FLAG, ScreenNavigationProp } from '@/src/navigation';
import { ApprovalTurnDownForm } from './components';

export const ApprovalTurnDown = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  return (
    <SafeAreaView className="relative">
      <ApprovalTurnDownForm
        onSuccess={() => {
          navigation.navigate(ROUTER_FLAG.Approval);
        }}
      />
    </SafeAreaView>
  );
};
