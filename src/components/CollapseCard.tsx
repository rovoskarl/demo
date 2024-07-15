import { primary } from '@/src/components/Theme/colors';
import { Right } from '@/src/icons';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import { Separator, Text, View, XStack } from 'tamagui';

type IProps = {
  title: string;
  children: React.ReactNode;
  duration?: number;
};

export const CollapseCard = ({ title, duration = 300, children }: IProps) => {
  const [open, setOpen] = useState(true);
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(open), {
      duration: duration,
    }),
  );

  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  return (
    <View className="bg-white rounded-lg">
      <XStack padding={12} alignItems="center" justifyContent="space-between">
        <View>
          <Text fontSize={14} fontWeight={'bold'} style={{ color: '#141414' }}>
            {title}
          </Text>
        </View>
        <View onPress={() => setOpen(!open)}>
          <Text fontSize={14} className="text-primary">
            {open ? '收起' : '展开'}{' '}
            <Right transform={open ? 'rotate(-90 9 9)' : 'rotate(90 8 6)'} color={primary.DEFAULT} />
          </Text>
        </View>
      </XStack>
      <Animated.View style={[styles.animatedView, bodyStyle]}>
        <Separator />
        <View
          key={1}
          onLayout={(e) => {
            height.value = e.nativeEvent.layout.height;
          }}
          style={styles.wrapper}
        >
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    position: 'absolute',
  },
  animatedView: {
    width: '100%',
    overflow: 'hidden',
  },
});
