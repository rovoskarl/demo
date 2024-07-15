import { FC } from 'react';
import { Text, XStack, YStack, Stack } from 'tamagui';
import { AssetType } from '@/src/models/asset';
import { Pressable, TouchableWithoutFeedback, Image, Platform } from 'react-native';

import Video, { ResizeMode } from 'react-native-video';
import { Switch } from './Switch';

export type ImageItemProps = AssetType & { isSelected: boolean };

interface Props {
  date: string;
  images: ImageItemProps[];
  isEdit?: boolean;
  onSelectedAll?: (images: ImageItemProps[]) => void;
  onSelected?: (images: ImageItemProps) => void;
  onDeleted?: (images: ImageItemProps) => void;
  onModal: (image: ImageItemProps) => void;
}

function isToday(dateString: string) {
  const inputDate = new Date(dateString);
  const today = new Date();

  return (
    inputDate.getFullYear() === today.getFullYear() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getDate() === today.getDate()
  );
}

export const ImageItem: FC<Props> = ({ date, images, isEdit, onSelected, onSelectedAll, onModal }) => {
  return (
    <YStack marginLeft="$3.5">
      <XStack marginRight="$3.5" justifyContent="space-between">
        <Text color="$black8Light" fontSize={14} fontWeight="500">
          {isToday(date) ? '今天' : date} （{images.length}）
        </Text>
        {isEdit && (
          <TouchableWithoutFeedback onPress={() => onSelectedAll?.(images)}>
            <Text color="rgba(0, 0, 0, 0.45)" fontSize={14} fontWeight="500">
              全选
            </Text>
          </TouchableWithoutFeedback>
        )}
      </XStack>

      <XStack justifyContent="flex-start" flexWrap="wrap" space="$2" paddingTop="$2.5">
        {images.map((image, index) => (
          <Pressable key={image.id.toString()} onPress={() => onModal(image)}>
            <XStack
              overflow="hidden"
              position="relative"
              alignItems="center"
              marginBottom="$2.5"
              justifyContent="center"
              key={index}
            >
              {image.type === 'video' ? (
                <Video
                  style={{
                    width: 108,
                    height: 72,
                    borderRadius: 9,
                  }}
                  resizeMode={ResizeMode.COVER}
                  source={{
                    uri: Platform.OS === 'android' ? `file://${image.path}` : image.path,
                  }}
                  controls={false}
                  paused={true}
                />
              ) : (
                <Image
                  source={{
                    uri: Platform.OS === 'android' ? `file://${image.path}` : image.path,
                  }}
                  style={{
                    width: 108,
                    height: 72,
                    borderRadius: 9,
                  }}
                  onError={(error) => {
                    console.log('erros', error.nativeEvent.error);
                  }}
                />
              )}
              {isEdit && (
                <Stack position="absolute" zIndex={9} top={4} right={4} backgroundColor="transparent">
                  <Switch
                    onChange={(val) =>
                      onSelected?.({
                        ...image,
                        isSelected: val,
                      })
                    }
                    checked={image.isSelected}
                  />
                </Stack>
              )}
            </XStack>
          </Pressable>
        ))}
      </XStack>
    </YStack>
  );
};
