import { ComponentProps, FC } from 'react';
import { Modal, Image, TouchableWithoutFeedback, View, Text, SafeAreaView } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { IImageInfo } from 'react-native-image-zoom-viewer/built/image-viewer.type';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WaterMarkVideo } from './WaterMarkVideo';
import { WaterMarkImage } from './WaterMarkImage';

export interface ImageViewerProps extends Omit<ComponentProps<typeof ImageViewer>, 'onCancel'> {
  visible?: boolean;
  onClose?: () => void;
  onRemove?: (image: IImageInfo) => void;
}

function isVideo(url: string): boolean {
  const extension = url.split('.').pop()?.toLowerCase();
  return ['mp4', 'avi', 'mov', 'flv', 'wmv'].includes(extension ?? '');
}

export const ZoomImage: FC<ImageViewerProps> = ({ visible, onClose, onRemove, ...props }) => {
  const inset = useSafeAreaInsets();

  const renderVideo = (url: string) => {
    return (
      <View className="relative flex-1 items-center justify-center">
        <WaterMarkVideo
          watermark="Watermark"
          source={{
            uri: url,
          }}
        />
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent onRequestClose={onClose}>
      <View className="bg-black/0" />
      {/* <ImageViewer
        enableImageZoom
        enableSwipeDown
        onCancel={onClose}
        renderImage={(imageProps) => {
          const { source } = imageProps;
          console.log('imageProps', imageProps);
          if (isVideo(source?.uri)) {
            return renderVideo(source.uri);
          } else {
            return (
              <View className="relative w-full items-center justify-center bg-primary">
                <WaterMarkImage watermark="watermark" style={imageProps.style} source={source} />
              </View>
            );
          }
        }}
        {...props}
        renderIndicator={() => <View />}
        renderFooter={() => (
          <SafeAreaView>
            <View className={'relative flex-row bottom-0'}>
              <View className="flex-row w-full items-center justify-center">
                <TouchableWithoutFeedback
                  onPress={() => {
                    onClose?.();
                    onRemove?.(props.imageUrls[props.index ?? 0]);
                  }}
                >
                  <View className="rounded-lg py-2 px-10 border border-white">
                    <Text className="text-white text-base font-medium">删除</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </SafeAreaView>
        )}
      /> */}
    </Modal>
  );
};
