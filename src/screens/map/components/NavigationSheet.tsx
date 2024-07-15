import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Button, Sheet, Text, View } from 'tamagui';
import { useGaodeNavigation } from '../hooks';
import { PointNavi } from '@/src/icons';

export const NavigationSheet = (props: any) => {
  const [open, setOpen] = useState(false);
  const { type = 'button', item, buttonStyle, iconStyle, ...rest } = props;

  const { openGaodeMap, openBaiduMap } = useGaodeNavigation(item);

  // useEffect(() => {
  //   console.log('====', open);
  // }, [open]);
  return (
    <>
      {type === 'button' ? (
        <Button
          backgroundColor="#00BBB4"
          color="$white"
          fontSize={16}
          {...buttonStyle}
          {...rest}
          onPress={() => {
            setOpen(true);
          }}
        >
          导航
        </Button>
      ) : null}
      {type === 'icon' ? (
        <TouchableOpacity
          onPress={() => {
            console.log(1111, open);

            setOpen(true);
          }}
        >
          <PointNavi {...iconStyle} />
        </TouchableOpacity>
      ) : null}
      {open ? (
        <Sheet dismissOnOverlayPress={false} animation="medium" modal snapPoints={[25]} native open={open}>
          <Sheet.Overlay animation="medium" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
          <Sheet.Frame flex={1} backgroundColor="#FFFFFF">
            <TouchableOpacity
              onPress={() => {
                openGaodeMap();
              }}
            >
              <Text fontSize={16} textAlign="center" paddingTop={24} paddingBottom={16} backgroundColor="#fff">
                高德地图
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                openBaiduMap();
              }}
            >
              <Text fontSize={16} textAlign="center" paddingTop={24} paddingBottom={16} backgroundColor="#fff">
                百度地图
              </Text>
            </TouchableOpacity>
            <View width={'100%'} height={12} backgroundColor={'#F5F5F5'} />
            <TouchableOpacity
              onPress={() => {
                setOpen(false);
              }}
            >
              <Text fontSize={16} textAlign="center" paddingTop={16} paddingBottom="$4" backgroundColor="#fff">
                取消
              </Text>
            </TouchableOpacity>
          </Sheet.Frame>
        </Sheet>
      ) : null}
    </>
  );
};
