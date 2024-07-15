import * as React from 'react';
import { SafeAreaView, TouchableOpacity } from 'react-native';

import { Button, Input, XStack } from 'tamagui';
import { Back } from '@/src/icons';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '@/src/navigation';
import { SearchEmpty, SearchHistory, SearchResult } from './components';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MAP_KEY_WEB } from './constant/constants';
import { useLocation, usePositionListWithSearch } from './hooks';
import { ScrollView } from 'react-native-gesture-handler';

export const MapSearchScreen = () => {
  const navigation = useNavigation<ScreenNavigationProp>();

  const [keyword, setKeyword] = useState('');
  const [mapSearchResult, setMapSearchResult] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<any[]>([]);

  const { list: positionList, updatePositionName, loadMore, hasMore, setList } = usePositionListWithSearch();
  const { location } = useLocation();

  useEffect(() => {
    AsyncStorage.getItem('mapSearchHistory').then((data) => {
      if (data) {
        const parsedData = JSON.parse(data);
        setSearchHistory(parsedData);
        if (keyword) {
          const newHistory = [keyword, ...parsedData];
          const uniqueHistory = Array.from(new Set(newHistory));

          AsyncStorage.setItem('mapSearchHistory', JSON.stringify(uniqueHistory));
        }
      } else {
        if (keyword) {
          AsyncStorage.setItem('mapSearchHistory', JSON.stringify([keyword]));
        }
      }
    });
  }, [keyword]);

  const clearSearchHistory = () => {
    AsyncStorage.removeItem('mapSearchHistory');
    setSearchHistory([]);
  };

  const queryCityData = () => {
    const { longitude, latitude } = location;
    return new Promise((resolve) => {
      fetch(`https://restapi.amap.com/v3/geocode/regeo?key=${MAP_KEY_WEB}&location=${longitude},${latitude}`)
        .then((response) => response.json())
        .then((data) => {
          const successFlag = data.status === '1' && data.info === 'OK';
          const geocodes = successFlag ? data?.regeocode?.addressComponent : {};
          try {
            const { city } = geocodes;
            resolve(city);
          } catch (err) {}
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };

  const onSearch = (text?: string) => {
    if (text) {
      setKeyword(text);
    }

    updatePositionName(text ? text : keyword);
    queryCityData().then((city: any) => {
      fetch(
        `https://restapi.amap.com/v3/place/text?keywords=${encodeURIComponent(
          text ? text : keyword,
        )}&city=${city}&key=${MAP_KEY_WEB}&offset=10`,
      )
        .then((response) => response.json())
        .then((data) => {
          const isTrue = data.status === '1' && data.info === 'OK';
          setMapSearchResult(isTrue ? data.pois : []);
        })
        .catch((error) => {
          console.error(error);
          setMapSearchResult([]);
        });
    });
  };

  return (
    <SafeAreaView>
      <XStack
        backgroundColor="white"
        margin={12}
        borderRadius={8}
        alignItems="center"
        justifyContent="space-between"
        paddingLeft="$3"
        paddingRight="$2"
        height="$4.5"
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Back />
        </TouchableOpacity>
        <Input
          borderWidth={0}
          flex={1}
          value={keyword}
          backgroundColor="white"
          placeholder="搜索内容或想标记的位置"
          onChangeText={(text: string) => {
            setList([]);
            setMapSearchResult([]);
            setKeyword(text);
            onSearch(text);
          }}
          fontSize={16}
        />
        <Button
          backgroundColor="#00BBB4"
          width={56}
          height="$3"
          padding={0}
          size={16}
          color="white"
          onPress={() => {
            onSearch();
          }}
        >
          搜索
        </Button>
      </XStack>

      {positionList?.length === 0 && mapSearchResult?.length === 0 && keyword ? (
        <SearchEmpty text="本地图内没有搜索结果" />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
          {keyword && (mapSearchResult.length > 0 || positionList?.length > 0) ? (
            <SearchResult
              hasMore={hasMore}
              loadMore={loadMore}
              shopSearchResult={positionList}
              mapSearchResult={mapSearchResult}
            />
          ) : null}

          {searchHistory.length > 0 && !keyword ? (
            <SearchHistory onSearch={onSearch} clearSearchHistory={clearSearchHistory} searchHistory={searchHistory} />
          ) : null}
        </ScrollView>
      )}

      {positionList?.length === 0 && mapSearchResult?.length === 0 && searchHistory.length === 0 && !keyword ? (
        <SearchEmpty />
      ) : null}
    </SafeAreaView>
  );
};
