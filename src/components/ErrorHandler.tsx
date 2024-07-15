import { FC, ReactElement } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import { useDependency } from '../ioc';
import { GlobalStore } from '../store';

type Props = {
  error: Error;
  resetError: () => void;
};

const ErrorFallback = ({ error, resetError }: Props) => {
  const global = useDependency(GlobalStore);
  return (
    <View className="flex-1 justify-center items-center">
      <Text>出了点问题:{error.message}</Text>
      <TouchableOpacity
        onPress={() => {
          global.reset();
          resetError();
        }}
        className="mt-2 p-3 rounded-xl bg-primary"
      >
        <Text className="text-white">重试</Text>
      </TouchableOpacity>
    </View>
  );
};

const onError = (error: Error, componentStack: string) => {
  console.log(error, componentStack);
};

export const ErrorHandler: FC<{ children: ReactElement }> = ({ children }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={onError}>
      {children}
    </ErrorBoundary>
  );
};
