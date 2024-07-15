import { Image, TouchableOpacity } from 'react-native';
import { PreviewImage, isVideoUrl } from '.';
import { Fragment, useState } from 'react';
import Video, { ResizeMode } from 'react-native-video';

export const Media = ({ url }: { url: string }) => {
  const isVideo = isVideoUrl(url);

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Fragment>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
      >
        {isVideo ? (
          <Video
            style={{
              width: 56,
              height: 56,
            }}
            resizeMode={ResizeMode.COVER}
            source={{
              uri: url,
            }}
            controls={false}
            paused={true}
          />
        ) : (
          <Image
            source={{
              uri: url,
              width: 56,
              height: 56,
            }}
          />
        )}
      </TouchableOpacity>
      {modalVisible ? (
        <PreviewImage
          uri={url}
          setModalVisible={() => {
            setModalVisible(!modalVisible);
          }}
          modalVisible={modalVisible}
        />
      ) : null}
    </Fragment>
  );
};
