import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'tamagui';

type Event = {
  id: string;
  time: string;
  render: () => React.ReactNode;
};

type TimelineProps = {
  events: Event[];
};

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <View>
      {events?.map((event) => {
        return (
          <View key={event.id} style={styles.event}>
            <View style={styles.dotWrapper}>
              <View style={styles.dot} />
              <View style={styles.line} />
            </View>
            <View style={styles.details}>
              <Text color="#858585" fontSize={12} lineHeight={20} marginBottom={4}>
                {event.time}
              </Text>
              {event.render()}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  event: {
    flexDirection: 'row',
  },
  dotWrapper: {
    position: 'relative',
    width: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00BBB4',
    alignSelf: 'center',
  },
  line: {
    position: 'absolute',
    top: 10,
    bottom: 0,
    width: 1,
    backgroundColor: '#00BBB4',
    alignSelf: 'center',
  },
  details: {
    marginLeft: 10,
    marginRight: 16,
    marginBottom: 24,
    marginTop: -4,
  },
});
