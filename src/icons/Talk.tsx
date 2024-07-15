import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Circle } from 'tamagui';
import Svg, { Path } from 'react-native-svg';

const styles = StyleSheet.create({
  line: {
    width: 4,
    backgroundColor: '#fff',
    borderRadius: 100,
  },
});

export const Talking = () => {
  const height = useSharedValue(0);
  const height_tow = useSharedValue(0);
  const height_three = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));
  const animatedStyle_tow = useAnimatedStyle(() => ({
    height: height_tow.value,
  }));
  const animatedStyle_three = useAnimatedStyle(() => ({
    height: height_three.value,
  }));

  useEffect(() => {
    height.value = withRepeat(
      withSequence(
        withTiming(6, { duration: 1000 / 2, easing: Easing.linear }),
        withTiming(12, { duration: 1000 / 2, easing: Easing.linear }),
        withTiming(8, { duration: 1000 / 2, easing: Easing.linear }),
      ),
      -1,
      true,
    );
    height_tow.value = withRepeat(
      withSequence(
        withTiming(12, { duration: 1000 / 2, easing: Easing.linear }),
        withTiming(6, { duration: 1000 / 2, easing: Easing.linear }),
        withTiming(10, { duration: 1000 / 2, easing: Easing.linear }),
      ),
      -1,
      true,
    );

    height_three.value = withRepeat(
      withSequence(
        withTiming(6, { duration: 1000 / 2, easing: Easing.linear }),
        withTiming(8, { duration: 1000 / 2, easing: Easing.linear }),
        withTiming(12, { duration: 1000 / 2, easing: Easing.linear }),
      ),
      -1,
      true,
    );
  }, [height, height_three, height_tow]);

  return (
    <Circle width="$1.5" height="$1.5" backgroundColor="#d8d8d8" flexDirection="row">
      <Animated.View style={[styles.line, animatedStyle]} />
      <Animated.View
        style={[
          styles.line,
          animatedStyle_tow,
          {
            marginHorizontal: 2,
          },
        ]}
      />
      <Animated.View style={[styles.line, animatedStyle_three]} />
    </Circle>
  );
};

export const Talk = (props: any) => {
  const { color = '#333' } = props;
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={22.16666603088379}
      height={23.333332061767578}
      viewBox="0 0 22.16666603088379 23.333332061767578"
      {...props}
    >
      <Path
        d="M4.667 6.417a6.417 6.417 0 1112.833 0v3.5a6.417 6.417 0 01-12.833 0v-3.5zm-2.334 3.5v.583a8.167 8.167 0 008.167 8.167h1.167a8.167 8.167 0 008.166-8.167v-.583h2.334v.583c0 5.603-4.39 10.181-9.917 10.484v2.35H9.917v-2.35C4.389 20.681 0 16.104 0 10.5v-.583h2.333z"
        fillRule="evenodd"
        fill={color}
      />
    </Svg>
  );
};
