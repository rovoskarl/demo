import { useEffect } from 'react';
import { WatermarkView } from './WatermarkView';
import VideoPlayer, { VideoPlayerProps } from 'react-native-media-console';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Orientation from 'react-native-orientation-locker';
import { useNavigation } from '@react-navigation/core';
import { useAnimations } from '@react-native-media-console/reanimated';

interface Props {
  source?: VideoPlayerProps['source'];
  watermark: string;
}

// const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const WaterMarkVideo = ({ source, watermark }: Props) => {
  const height = useSharedValue(300);
  const navigation = useNavigation();

  // const [isFullScreen, setIsFullScreen] = useState(false);

  // const toggleFullScreen = (fullscreen: boolean) => {
  //   setIsFullScreen(fullscreen);
  //   if (fullscreen) {
  //     height.value = SCREEN_HEIGHT;
  //   } else {
  //     height.value = 300;
  //   }
  // };

  useEffect(() => {
    return () => {
      Orientation.lockToPortrait();
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  const onBack = () => {
    // go back
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <Animated.View className="w-full h-[300]" style={[animatedStyle]}>
      <WatermarkView watermark={watermark} itemWidth={120} itemHeight={120} rotateZ={-45}>
        <VideoPlayer
          source={source}
          disableBack
          disableTimer
          disableVolume
          disableSeekbar
          disableFullscreen
          disableDisconnectError
          disableSeekButtons
          onBack={onBack}
          useAnimations={useAnimations}
        />
      </WatermarkView>
    </Animated.View>
  );
};
