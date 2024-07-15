import Video, { ResizeMode } from 'react-native-video';
import { Button, View } from 'tamagui';
import Modal from 'react-native-modal';
import { Close } from '@/src/icons';
import { Modal as Modal1 } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { isVideoUrl } from './FieldsForm';

export const PreviewImage = ({ modalVisible, setModalVisible, uri }: any) => {
  const isVideo = isVideoUrl(uri);

  return isVideo ? (
    <Modal isVisible={modalVisible}>
      <View alignItems="center" padding="$8" backgroundColor="$white" position="relative" width="100%" maxHeight="80%">
        <Button
          onPress={() => {
            setModalVisible(false);
          }}
          position="absolute"
          top="$2"
          right="$2"
          size="$2"
          circular
          icon={Close}
        />
        <Video
          style={{
            width: 300,
            height: 300,
          }}
          resizeMode={ResizeMode.COVER}
          source={{
            uri,
          }}
          controls={true}
        />
      </View>
    </Modal>
  ) : (
    <View
      style={{
        padding: 10,
      }}
    >
      <Modal1 visible={true} transparent={true}>
        <ImageViewer
          imageUrls={[{ url: uri }]}
          enableSwipeDown={true}
          onSwipeDown={() => setModalVisible(false)}
          onClick={() => setModalVisible(false)}
        />
      </Modal1>
    </View>
  );
};
