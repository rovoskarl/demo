import * as React from 'react';
import { MapView } from '@tastien/react-native-amap3d';
import { View } from 'tamagui';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  useLocation,
  usePoints,
  usePosition,
  useRenderType,
  useSearch,
  useService,
  useShowConfig,
  useTask,
} from './hooks';
import { MapMarkerLocation } from './markerLocation';
import { useOSSToken } from './hooks/useOSSToken';
import * as AliyunOSS from '@tastien/react-native-oss-sdk';
import { ROUTER_FLAG, ScreenNavigationProp } from '@/src/navigation';
import { useNavigation } from '@react-navigation/native';
import {
  ActionButtonGroup,
  AdministrativeMap,
  AvatarContent,
  GroupPointMask,
  HomeActionButtonsSheet,
  SearchGroup,
  Map,
} from './components';
import { MapNearPosition } from './nearPosition';
import { MapList } from './MapList';

export const MapScreen: React.FC = () => {
  const { setPositionInfo } = usePosition();
  const mapViewRef = useRef<MapView>(null);
  const { points, update } = usePoints();
  const { list: taskList } = useTask();
  const { location, setLocation, moveCameraWithLocation } = useLocation();
  const {
    config: { isShowAdministrative },
  } = useShowConfig();
  const [key, setKey] = useState(0);

  const { type } = useRenderType();
  const { getOSSToken } = useService();
  const { token: ossToken, initToken } = useOSSToken();

  const navigation = useNavigation<ScreenNavigationProp>();

  useEffect(() => {
    if (!ossToken) {
      getOSSToken().then((token) => {
        const expirationDate = new Date(token.expiration?.epochSecond * 1000).toISOString();

        AliyunOSS.initSDK(
          token.securityToken,
          token.accessKeyId,
          token.accessKeySecret,
          'https://oss-cn-shanghai.aliyuncs.com',
          expirationDate,
        );
        initToken(token);
      });
    }
  }, [getOSSToken, initToken, ossToken]);

  useEffect(() => {
    if (points?.[0] && type === 'home') {
      const target: any = points?.[0];
      console.log('========', points.length);
      mapViewRef.current?.moveCamera(
        {
          zoom: 16.5,
          target: { latitude: target.latitude, longitude: target.longitude },
        },
        1000,
      );
      setLocation({ latitude: target?.latitude, longitude: target?.longitude });
    }
  }, [points, setLocation, type]);

  const movePosition = useCallback(() => {
    moveCameraWithLocation(mapViewRef);
  }, [moveCameraWithLocation]);

  const onMarkerPress = useCallback(
    (detail: any) => {
      setPositionInfo(detail);
      setLocation({ latitude: detail?.latitude, longitude: detail?.longitude });
      if (detail?.type === 'task') {
        navigation.navigate(ROUTER_FLAG.MapCollectionsTaskDetail, {
          taskId: detail?.id,
        });
      } else {
        navigation.navigate(ROUTER_FLAG.MapPointDetail, { latitude: detail?.latitude, longitude: detail?.longitude });
      }
    },
    [navigation, setLocation, setPositionInfo],
  );

  const className = useMemo(() => {
    switch (type) {
      case 'home':
        return 'w-full h-full';
      case 'markerLocation':
      case 'nearPosition':
      case 'list':
        return 'w-full h-3/6';
      default:
        return '';
    }
  }, [type]);

  const positionList = useMemo(() => {
    return [...points, ...taskList];
  }, [points, taskList]);

  return (
    <View style={{ position: 'relative' }}>
      <View className="w-full h-full">
        <View className={className}>
          {isShowAdministrative ? (
            <AdministrativeMap key={key} location={location} positionList={positionList} />
          ) : (
            <Map positionList={positionList} mapViewRef={mapViewRef} onMarkerPress={onMarkerPress} />
          )}
        </View>

        {type === 'home' && (
          <HomeComponent
            moveCameraWithLocation={movePosition}
            mapViewRef={mapViewRef}
            initPosition={() => {
              update({});
            }}
            setKey={setKey}
          />
        )}
        {type === 'markerLocation' && (
          <MapMarkerLocation mapViewRef={mapViewRef} moveCameraWithLocation={movePosition} />
        )}
        {type === 'nearPosition' ? <MapNearPosition /> : null}
        {type === 'list' && (
          <MapList
            onUpdate={() => {
              setKey((prevKey) => prevKey + 1);
            }}
          />
        )}
      </View>
    </View>
  );
};

type HomeComponentProps = {
  moveCameraWithLocation: () => void;
  initPosition: () => void;
  setKey: React.Dispatch<React.SetStateAction<number>>;
  mapViewRef: React.RefObject<MapView>;
};

const HomeComponent: React.FC<HomeComponentProps> = ({ mapViewRef, moveCameraWithLocation, initPosition, setKey }) => {
  const { update } = useRenderType();
  const { searchType, setSearchType } = useSearch();

  return (
    <>
      <AvatarContent
        onUpdate={() => {
          setKey((prevKey) => prevKey + 1);
        }}
      />
      <SearchGroup
        top={'7.5%'}
        onUpdate={() => {
          setKey((prevKey) => prevKey + 1);
        }}
      />
      {searchType && (
        <GroupPointMask
          bottom={0}
          onPress={() => {
            setSearchType(null);
          }}
        />
      )}

      <ActionButtonGroup
        onPosition={() => {
          moveCameraWithLocation();
        }}
        onShow={() => {
          initPosition();
          setKey((prevKey) => prevKey + 1);
        }}
        onList={() => {
          update('list');
          // navigation.replace(ROUTER_FLAG.MapPunterManage);
        }}
      />
      <HomeActionButtonsSheet mapViewRef={mapViewRef} />
    </>
  );
};
