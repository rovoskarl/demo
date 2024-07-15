import { WatermarkView } from './WatermarkView';
import { ImageStyle, ImageURISource } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { useZoomAnimated } from '../hooks/useZoomAnimated';
import { ImageZoom } from '@likashefqet/react-native-image-zoom';

interface Props {
  watermark: string;
  source: ImageURISource;
  style?: ImageStyle;
}

export const WaterMarkImage = ({ watermark, source }: Props) => {
  const { gesture } = useZoomAnimated({
    min_scale: 1,
    max_scale: 6,
  });

  return (
    <GestureDetector gesture={gesture}>
      <WatermarkView watermark={watermark} itemWidth={130} itemHeight={160} rotateZ={-35}>
        <ImageZoom uri={source.uri} minScale={0.8} maxScale={5} />
      </WatermarkView>
    </GestureDetector>
  );
};
