import { useLoader } from '@/src/hooks';
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';

export const FullScreenLoader: React.FC = () => {
  const { visible } = useLoader();
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    let timeoutId: any;
    let fallbackTimeoutId: any;

    if (visible) {
      setIsVisible(true);
      fallbackTimeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    } else {
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 500);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (fallbackTimeoutId) {
        clearTimeout(fallbackTimeoutId);
      }
    };
  }, [visible]);

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00BBB4" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
