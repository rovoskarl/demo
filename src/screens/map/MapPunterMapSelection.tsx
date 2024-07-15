import React, { useRef, useEffect } from 'react';
import { SafeAreaView, View, TouchableOpacity } from 'react-native';
import { MapView, Polygon } from '@tastien/react-native-amap3d';
import { Button, Text } from 'tamagui';
import { useLocation, useGroupMapPolygon, useGroupMapPointCalculate, usePoints } from './hooks';
import { ScreenNavigationProp } from '@/src/navigation';
import { useNavigation } from '@react-navigation/native';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import { useGroupMapSelection, usePointerGroupList } from './hooks';
import { MapPoint, ExpandGroupBatchOperation, SearchGroup, ConfirmModal } from './components';
import { ShopStatus1, ShopStatus4, DrawLine, Back as BackIcon } from '@/src/icons';
import { GroupManage, BatchOperation } from './constant/label';

export const MapPunterMapSelectionScreen = () => {
  const mapViewRef = useRef<MapView>(null);
  const canvasRef = useRef<SketchCanvas>(null);
  // 圈选状态
  const [selection, setSelection] = React.useState<boolean>(false);
  // 绘制与重绘状态
  const [draw, setDraw] = React.useState<boolean>(false);
  // 已选择数据
  const [ready, setReady] = React.useState<boolean>(true);
  const navigation = useNavigation<ScreenNavigationProp>();
  // 确认弹窗
  const [confirm, setConfirm] = React.useState<boolean>(false);
  // 隐藏
  const [hideElement, setHideElement] = React.useState<boolean>(true);
  const [latLngBounds, setLatLngBounds] = React.useState<any>(null);
  // 点位列表
  const { points } = usePoints();
  // 定位点
  const { location, setLocation } = useLocation();
  // 圈选围栏集合
  const { polygonItem, setPolygonItem } = useGroupMapPolygon();
  // 圈选校验筛选点位
  const { validSelectedPoint, pathToPolygonPoint } = useGroupMapPointCalculate();
  const { setSelectType, setSelectMode, setFolderIds, setPointerIds } = useGroupMapSelection();
  const { clearGroupSelectionStore, updateSinglePositionItem } = usePointerGroupList();

  /**
   * @method        initPosition
   * @description   初始化点位
   * @param         {Object}    mapViewRef
   */

  useEffect(() => {
    if (points?.[0]) {
      const target: any = points?.[0];
      mapViewRef.current?.moveCamera(
        {
          zoom: 10,
          target: { latitude: target.latitude, longitude: target.longitude },
        },
        1000,
      );
      setLocation({ latitude: target?.latitude, longitude: target?.longitude });
    }
  }, [points, setLocation]);

  return (
    <SafeAreaView>
      {confirm ? (
        <ConfirmModal
          mask={true}
          tipContent={GroupManage.returnClearTip}
          cancelHandler={() => {
            setConfirm(false);
          }}
          confirmHandler={() => {
            clearGroupSelectionStore();
            setSelectType('list');
            setSelectMode(false);
            navigation.goBack();
          }}
        />
      ) : null}
      <View style={{ position: 'relative' }} className="w-full h-full">
        {/* 圈选选择 */}
        {!selection && hideElement ? (
          <View style={{ zIndex: 8, top: 126 }} className="absolute w-full justify-center content-center items-center">
            <Button
              backgroundColor="#00BBB4"
              color="#fff"
              onPress={() => {
                setSelection(true);
                setDraw(true);
                setPolygonItem([]);
              }}
            >
              {GroupManage.circleSelection}
            </Button>
          </View>
        ) : null}
        {!selection && hideElement ? (
          <View style={{ zIndex: 8, marginTop: 20, height: 90 }} className="relative bg-white ml-4 mr-4 rounded-lg">
            <SearchGroup onUpdate={() => {}} left={0} right={0} top={52} />
          </View>
        ) : null}
        {!selection && hideElement ? (
          <View className="absolute top-0 left-2" style={{ zIndex: 8 }}>
            <TouchableOpacity
              onPress={() => {
                setFolderIds([]);
                setPointerIds([]);
                navigation.goBack();
              }}
            >
              <View className="flex flex-row" style={{ position: 'relative' }}>
                <TouchableOpacity
                  onPress={() => {
                    setConfirm(true);
                  }}
                  className="left-4 top-8"
                >
                  <BackIcon />
                </TouchableOpacity>
                <Text className="absolute text-lg font-bold left-11 top-7">{GroupManage.mapSelection}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : null}
        {!draw ? (
          <Polygon
            strokeWidth={1}
            strokeColor="rgba(0, 0, 255, 0.5)"
            fillColor="rgba(255, 0, 0, 0.3)"
            points={polygonItem}
          />
        ) : null}
        <MapPoint
          mapViewRef={mapViewRef}
          positionList={points?.filter((item: any) => item?.positionType === 1)}
          zoom={!selection}
          scroll={!selection}
          location={location}
          polygonPoints={polygonItem}
          onMarkerPress={(item) => {
            updateSinglePositionItem(item);
          }}
          onCameraIdle={(nativeEvent) => {
            if (nativeEvent?.latLngBounds) {
              setLatLngBounds(nativeEvent.latLngBounds);
            }
          }}
        />
        {draw ? (
          <SketchCanvas
            ref={canvasRef}
            style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.125)' }}
            onStrokeEnd={(p) => {
              const pathsPoints = p?.path?.data;
              if (pathsPoints) {
                const canvasSize = p.size;
                const pathsInLatLng = pathToPolygonPoint(pathsPoints, latLngBounds, canvasSize);
                setPolygonItem(pathsInLatLng);
              }
              setDraw(false);
            }}
            strokeColor={'red'}
            strokeWidth={3}
          />
        ) : null}
        {selection ? (
          <View className="absolute w-full bottom-6 z-30 p-4">
            <View className="flex flex-row items-center justify-center">
              <Button
                backgroundColor="#FFF"
                className="mr-4"
                size="$3.5"
                style={{
                  paddingLeft: 12,
                  paddingRight: 12,
                }}
                icon={() => <ShopStatus4 width={24} height={24} />}
                onPress={() => {
                  setSelection(false);
                  setDraw(false);
                  setPolygonItem([]);
                }}
              >
                {BatchOperation.cancelText}
              </Button>
              <Button
                color="#FFF"
                borderRadius="$3"
                fontSize={16}
                alignSelf="center"
                disabled={draw}
                style={{ backgroundColor: '#00BBB4' }}
                icon={() => <DrawLine color={'#FFF'} width={24} height={24} />}
                size="$4.5"
                onPress={() => {
                  if (polygonItem?.length) {
                    setDraw(true);
                    setPolygonItem([]);
                  }
                }}
              >
                <Text className="text-white text-lg">{GroupManage.reDrawText}</Text>
              </Button>
              <Button
                className="ml-4"
                disabled={draw}
                size="$3.5"
                style={{
                  backgroundColor: polygonItem?.length ? '#FFF' : 'rgba(255, 255, 255, 0.6)',
                  paddingLeft: 12,
                  paddingRight: 12,
                }}
                icon={() => <ShopStatus1 color={polygonItem?.length ? '#00BBB4' : '#B2EBE8'} width={24} height={24} />}
                onPress={() => {
                  const valid = validSelectedPoint(
                    polygonItem,
                    points?.filter((item: any) => item?.positionType === 1),
                  );
                  if (!valid) {
                    return false;
                  }
                  setReady(true);
                  setSelection(false);
                  setDraw(false);
                  setPolygonItem([]);
                }}
              >
                {BatchOperation.confirmText}
              </Button>
            </View>
          </View>
        ) : null}
        {ready && !selection ? (
          <View className="absolute bottom-0 w-full">
            <ExpandGroupBatchOperation
              page="mapSelection"
              handleModal={(flag: any) => {
                setHideElement(flag);
              }}
            />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};
