import React, { useRef, useState, useEffect, useCallback } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { Dimensions, SectionList, StyleSheet, TouchableOpacity, SectionListData } from 'react-native';
import { Input, Group, Separator, Button } from 'tamagui';

import { Back as BackIcon } from '@/src/icons';
import { cityDataList, hotCityList } from './expandPunterCityData';
import { Position } from '../../icons/Position';
import { useExpandPunter, useBatchExpand } from './hooks';

interface MutableRefObject<T> {
  current: T;
}
const { height } = Dimensions.get('window');

export const CityLocation = ({ updateKeyword }: { updateKeyword: (keyword: string) => void }) => {
  const [current, setCurrent] = useState<string>('正在定位...');
  const [searchKey, setSearckKey] = useState<string>('');
  const { navigation } = useExpandPunter();
  const { selectedCity } = useBatchExpand();

  const gotCurrentLocation = useCallback(async () => {
    setCurrent(selectedCity?.name || '福州');
  }, [selectedCity]);

  useEffect(() => {
    gotCurrentLocation();
  }, [gotCurrentLocation]);

  return (
    <View style={{ flex: 0.18 }}>
      <View className="w-11/12 left-4 mt-4 bg-white rounded-md">
        <Group orientation="horizontal" className="flex flex-row h-12">
          <Group.Item>
            <View className="ml-2 mt-3">
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <BackIcon />
              </TouchableOpacity>
            </View>
          </Group.Item>
          <Separator alignSelf="stretch" vertical marginVertical={12} />
          <Group.Item>
            <Input
              placeholder="中文"
              value={searchKey}
              flex={1}
              borderWidth={0}
              style={{ backgroundColor: '#FFF' }}
              onChangeText={(text) => {
                setSearckKey(text);
                updateKeyword(text);
              }}
            />
          </Group.Item>
        </Group>
        <Separator alignSelf="stretch" className="border-gray-100" />
        <View className="flex flex-row pt-1 pl-1">
          <Position />
          <Text className="leading-10 text-slate-800">当前定位城市</Text>
          <Text className="leading-10 ml-2 text-slate-800">{current}</Text>
        </View>
      </View>
    </View>
  );
};

export const CityHot = () => {
  const { handleSelectCity } = useExpandPunter();

  return (
    <View style={{ flex: 0.16 }}>
      <View className="w-11/12 h-24 left-4 bg-white rounded-md">
        <Text className="h-12 leading-10 ml-4">热门城市</Text>
        <Separator alignSelf="stretch" className="border-gray-100" />
        <View className="flex flex-row justify-between ml-4 mr-4">
          {hotCityList.map((item) => {
            return (
              <Button
                className="rounded h-6 mt-2 leading-6"
                key={item.code}
                onPress={() => {
                  handleSelectCity(item);
                }}
              >
                {item.name}
              </Button>
            );
          })}
        </View>
      </View>
    </View>
  );
};

// 渲染城市列表
export const CityList = ({ keyword }: { keyword: string }) => {
  const scrollViewRef: MutableRefObject<any> = useRef(null);
  const [cityList, setCityList] = useState<SectionListData<any, Record<string, any>>[]>([]);
  const { handleSelectCity } = useExpandPunter();

  useEffect(() => {
    setCityList([...cityDataList]);
  }, []);

  useEffect(() => {
    if (keyword) {
      const newCityData = cityDataList.reduce((result: any, sectionData) => {
        const { title, data } = sectionData;
        const filteredData = data.filter((element) => element?.name.includes(keyword));
        if (filteredData.length !== 0) {
          result.push({
            title,
            data: filteredData,
          });
        }
        return result;
      }, []);
      setCityList([...newCityData]);
    } else {
      setCityList([...cityDataList]);
    }
  }, [keyword]);

  return (
    <View style={{ flex: 0.6 }}>
      <View className="grow w-11/12 left-4 bg-white rounded-md">
        <SectionList
          ref={scrollViewRef}
          sections={cityList}
          keyExtractor={(item, index) => item.name + index}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.code}
              onPress={() => {
                handleSelectCity(item);
              }}
            >
              <View style={styles.cityTextBox}>
                <Text style={styles.cityTextStyle}>{item.name}</Text>
              </View>
              <Separator alignSelf="stretch" className="border-gray-100" />
            </TouchableOpacity>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View className="w-full h-10" style={styles.cityLetterBox}>
              <Text style={styles.cityLetterText}>{title}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

/**
 * @component         ExpandPunterScreen
 * @description       一键拓客城市列表页面
 */
export const ExpandPunterCityScreen = () => {
  const [keyword, setKeyword] = useState<string>('');

  const updateKeyword = useCallback(
    (content: string) => {
      setKeyword(content);
    },
    [setKeyword],
  );

  return (
    <SafeAreaView>
      <View style={{ position: 'relative', height: height, backgroundColor: '#fff' }}>
        <View style={styles.cityContainer}>
          <CityLocation updateKeyword={updateKeyword} />
          <CityHot />
          <CityList keyword={keyword} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cityContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#f4f4f4',
  },
  cityLetterBox: {
    height: 48,
    backgroundColor: '#F4F4F4',
    justifyContent: 'center',
  },
  cityLetterText: {
    fontSize: 16,
    marginLeft: 20,
  },
  cityTextBox: {
    height: 48,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginLeft: 20,
  },
  cityTextStyle: {
    color: '#333333',
    fontSize: 14,
  },
});
