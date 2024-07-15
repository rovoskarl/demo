import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { clamp, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type ZoomAnimatedProps = {
  max_scale?: number;
  min_scale?: number;
  image_width?: number;
  image_height?: number;
};

const { width: INIT_WIDTH, height: INIT_HEIGHT } = Dimensions.get('window');

export const useZoomAnimated = ({
  min_scale = 0.8,
  max_scale = 6,
  image_width = 400,
  image_height = 600,
}: ZoomAnimatedProps) => {
  const scale = useSharedValue(1);

  const navigation = useNavigation();

  const initTranslate = { x: useSharedValue(0), y: useSharedValue(0) };

  const recordTranslate = { x: useSharedValue(0), y: useSharedValue(0) };

  const translate = { x: useSharedValue(0), y: useSharedValue(0) };

  const onBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      const position_x = Math.max(0, Math.round(image_width * scale.value - INIT_WIDTH)) / 2;
      const position_y = Math.max(0, Math.round(image_height * scale.value - INIT_HEIGHT)) / 2;
      initTranslate.x.value = position_x <= 0 ? 0 : position_x;
      initTranslate.y.value = position_y <= 0 ? 0 : position_y;
    })
    .onUpdate((e) => {
      translate.x.value = clamp(
        e.translationX + recordTranslate.x.value,
        -initTranslate.x.value,
        initTranslate.x.value,
      );
      translate.y.value = clamp(
        e.translationY + recordTranslate.y.value,
        -initTranslate.y.value,
        initTranslate.y.value,
      );
    })
    .onEnd((e) => {
      recordTranslate.x.value = translate.x.value;
      recordTranslate.y.value = translate.y.value;
      if (initTranslate.y.value <= 0 && initTranslate.x.value <= 0) {
        if (e.velocityY > 1000) {
          console.log('end back');
          runOnJS(onBack)();
        }
      }
    });

  const doubleTap = Gesture.Tap()
    .maxDuration(500)
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value === 1) {
        scale.value = 2;
      } else {
        scale.value = 1;
        // 缩小，直接回到初始值
        translate.x.value = withTiming(0);
        translate.y.value = withTiming(0);
      }
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = clamp(scale.value * e.scale, min_scale, max_scale);
    })
    .onEnd(() => {
      const position_x = Math.max(0, Math.round(image_width * scale.value - INIT_WIDTH)) / 2;
      const position_y = Math.max(0, Math.round(image_height * scale.value - INIT_HEIGHT)) / 2;
      scale.value = scale.value;
      //   正Y
      if (translate.y.value > 0) {
        if (position_y < translate.y.value) {
          translate.y.value = withTiming(position_y);
        }
      }

      //   负Y
      if (translate.y.value < 0) {
        if (-position_y < -translate.y.value) {
          translate.y.value = withTiming(-position_y);
        }
      }

      //   正X
      if (translate.x.value > 0) {
        if (position_x < translate.x.value) {
          translate.x.value = withTiming(position_x);
        }
      }

      //   负X
      if (translate.x.value < 0) {
        if (-position_x < -translate.x.value) {
          translate.x.value = withTiming(-position_x);
        }
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translate.x.value },
      { translateY: translate.y.value },
      { scale: withTiming(scale.value) },
    ],
  }));

  const gesture = Gesture.Simultaneous(pinchGesture, panGesture, doubleTap);

  return { animatedStyle, gesture };
};
