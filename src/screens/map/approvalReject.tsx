import { SafeAreaView } from 'react-native';
import { ApprovalRejectForm } from './components';
import { useNavigation } from '@react-navigation/native';
import { ROUTER_FLAG, ScreenNavigationProp } from '@/src/navigation';

export const ApprovalReject = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  return (
    <SafeAreaView className="relative">
      <ApprovalRejectForm
        onSuccess={() => {
          navigation.navigate(ROUTER_FLAG.Approval);
        }}
      />
    </SafeAreaView>
  );
};
