import React from 'react';
import { View, Text, Dimensions, ViewStyle, TextStyle } from 'react-native';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

type Props = {
  watermark: string;
  itemWidth?: number;
  itemHeight?: number;
  rotateZ?: number;
  watermarkStyle?: TextStyle;
  style?: ViewStyle;
  children: React.ReactNode;
  height?: number;
  className?: string;
};

export const WatermarkView = (props: Props) => {
  const renderWatermark = () => {
    const { watermark = '', itemWidth = 160, itemHeight = 100, watermarkStyle, rotateZ = -45, height = HEIGHT } = props;
    if (typeof watermark !== 'string' || (typeof watermark === 'string' && watermark.length < 1)) {
      return null;
    }
    const items = [];
    for (
      let index = 0;
      index < parseInt(String(height / itemWidth), 10) * parseInt(String(height / itemHeight), 10);
      index++
    ) {
      const item = (
        <View
          style={{
            width: itemWidth,
            height: itemHeight,
            transform: [{ rotateZ: `${rotateZ}deg` }],
          }}
          className="bg-black/0 items-center justify-center"
          key={'watermark_item' + index}
        >
          <Text style={watermarkStyle} className="text-lg text-white/40">
            {watermark}
          </Text>
        </View>
      );
      items.push(item);
    }
    return (
      <View
        className="bg-black/0 absolute top-0 bottom-0 left-0 right-0 flex-row justify-center items-center flex-wrap content-center"
        pointerEvents={'none'}
      >
        {items}
      </View>
    );
  };

  return (
    <View className="flex-1 overflow-hidden">
      {props.children}
      {renderWatermark()}
    </View>
  );
};
