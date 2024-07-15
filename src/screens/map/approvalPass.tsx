import { SafeAreaView } from 'react-native';
import { ApprovalPassForm } from './components';
import { useNavigation } from '@react-navigation/native';
import { ROUTER_FLAG, ScreenNavigationProp } from '@/src/navigation';

export const ApprovalPass = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  return (
    <SafeAreaView className="relative">
      <ApprovalPassForm
        onSuccess={() => {
          navigation.navigate(ROUTER_FLAG.Approval);
        }}
      />
    </SafeAreaView>
  );
};
