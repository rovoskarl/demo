import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface FadeInOutProps {
  isVisible: boolean;
  children: React.ReactNode;
}

export const FadeInOut: React.FC<FadeInOutProps> = ({ isVisible, children }) => {
  const opacity = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (isVisible) {
      opacity.value = withTiming(1);
    } else {
      opacity.value = withTiming(0);
    }
  }, [isVisible, opacity]);

  return <Animated.View style={[styles.container, animatedStyles]}>{isVisible && children}</Animated.View>;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    pointerEvents: 'box-only',
  },
});
