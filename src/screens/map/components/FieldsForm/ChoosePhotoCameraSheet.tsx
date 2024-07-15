import { ListItem, Sheet, SheetProps, Text, YGroup, YStack } from 'tamagui';
import { TouchableOpacity } from 'react-native';
import { useOSSClient } from '../../hooks/useOSSClient';
import { Asset, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Video, Image } from 'react-native-compressor';
import { isVideoUrl } from './const';
import { useLoader } from '@/src/hooks';

export const ChoosePhotoCameraSheet = (props: SheetProps & { onChange?: (res: string[]) => void }) => {
  const { uploadFile, getFileUrl } = useOSSClient();
  const { setVisible } = useLoader();
  const uploadFn = async (assets?: Asset[]) => {
    if (assets) {
      const uploadFiles = assets.map(async (item: any): Promise<string> => {
        const isVideo = isVideoUrl(item.uri);
        if (isVideo) {
          const result = await Video.compress(item.uri!, {
            progressDivider: 20,
            compressionMethod: 'manual',
            maxSize: 1280,
          });
          const value = await uploadFile(result);
          const url = await getFileUrl(value.fileName);
          return url;
        }

        const result = await Image.compress(item.uri, {
          compressionMethod: 'manual',
          maxWidth: 1000,
          quality: 0.1,
        });
        const value = await uploadFile(result);
        const url = await getFileUrl(value.fileName);
        return url;
      });
      const files = await Promise.all(uploadFiles);
      setVisible(false);
      props?.onChange?.(files);
    }
  };
  const onCamera = () => {
    launchCamera({ mediaType: 'mixed' }, async ({ assets }) => {
      if (assets && assets?.length > 0) {
        setVisible(true);
        uploadFn(assets);
      }
      props.onOpenChange?.(false);
    });
  };
  const onLibrary = () => {
    launchImageLibrary({ mediaType: 'mixed', selectionLimit: 9 }, async ({ assets }) => {
      if (assets && assets?.length > 0) {
        setVisible(true);
        uploadFn(assets);
      }
      props.onOpenChange?.(false);
    });
  };
  return (
    <Sheet dismissOnOverlayPress={false} animation="medium" modal snapPoints={[23]} native {...props}>
      <Sheet.Overlay animation="medium" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Frame flex={1} backgroundColor="#F5F5F5">
        <Sheet.ScrollView>
          <YStack space="$2">
            <YGroup>
              <YGroup.Item>
                <TouchableOpacity>
                  <ListItem
                    onPress={onCamera}
                    paddingTop="$4"
                    paddingBottom="$4"
                    backgroundColor="#fff"
                    justifyContent="center"
                  >
                    <Text>拍照</Text>
                  </ListItem>
                </TouchableOpacity>
              </YGroup.Item>
              <YGroup.Item>
                <TouchableOpacity>
                  <ListItem
                    onPress={onLibrary}
                    paddingTop="$4"
                    paddingBottom="$4"
                    backgroundColor="#fff"
                    justifyContent="center"
                  >
                    <Text>相册</Text>
                  </ListItem>
                </TouchableOpacity>
              </YGroup.Item>
              <TouchableOpacity onPress={() => props.onOpenChange?.(false)}>
                <ListItem marginTop="$4" paddingBottom="$4" backgroundColor="#fff" justifyContent="center">
                  <Text>取消</Text>
                </ListItem>
              </TouchableOpacity>
            </YGroup>
          </YStack>
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
};
