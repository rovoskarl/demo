import { AppState } from 'react-native';
import { focusManager, onlineManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';

export function config() {
  onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
      setOnline(!!state.isConnected);
    });
  });

  focusManager.setEventListener((handleFocus: any) => {
    const subscription = AppState.addEventListener('change', handleFocus);
    return () => {
      subscription.remove();
    };
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return {
    queryClient,
    QueryClientProvider,
  };
}
