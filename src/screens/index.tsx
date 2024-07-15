import React, { useEffect, useMemo } from 'react';
import { Image, Text } from 'tamagui';
import { NavigatorToken, ROUTER_FLAG, RootParams, Router, Tab } from '@/src/navigation';
import { LinkingOptions, NavigationContainer as RNNavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MeScreen } from './map/Me';
import { LunchScreen } from './lunch';
import { HomeScreen } from './home';
import { MapSearchScreen } from './map/search';
import { LoginScreen } from './login';
import { SystemSelectScreen } from './system';
import { ForgetPasswordScreen } from './password';
import { SettingScreen } from './setting';
import { PermissionScreen } from './permission';
import { AboutScreen } from './about';
import { MapMarkLocationInfoScreen } from './map/markerLocationInfo';

// 一键拓客-列表页
import { ExpandPunterScreen } from './map/expandPunter';
// 一键拓客-点位列表页
import { ExpandPunterListScreen } from './map/expandPunterList';
// 一键拓客-城市页
import { ExpandPunterCityScreen } from './map/expandPunterCity';
// 拓客列表-批量编辑
import { MapPunterBatchEditScreen } from './map/mapPunterBatchEdit';
// 拓客列表-地图选择
import { MapPunterMapSelectionScreen } from './map/MapPunterMapSelection';
// 审核通过
import { ApprovalPass } from './map/approvalPass';
// 审核不通过
import { ApprovalReject } from './map/approvalReject';
// 审核驳回
import { ApprovalTurnDown } from './map/approvalTurnDown';

import { NavigatorRef } from '@/src/navigation';
import { Loading, WatermarkView, WithAuth } from '@/src/components';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigatorType, RouterContext, useCookies, useRouter } from '@/src/hooks';
import { ApplicationType } from '@/src/interfaces/role';
import { MapFastMarkerLocationScreen } from './map/fastMarkerLocation';
import Config from 'react-native-config';
import { MapOperationRecordScreen } from './map/operationRecord';
import { container } from 'tsyringe';
import { useDependency } from '../ioc';
import { UserStore } from '../store';
import { SchemeLaunch } from './scheme-launch';
import { observer } from 'mobx-react-lite';
import SplashScreen from 'react-native-splash-screen';
import { TelephoneScreen } from './telephone';
import { AgentScreen } from './agent/agent';
import { ApprovalScreen } from './agent/approval';
import { MapPointDetailScreen } from './mapPointDetail';
import { MapCollectionsTaskDetailScreen } from './mapCollectionsTaskDetail';
import { TaskDispatchScreen } from './mapCollectionsTaskDetail/taskDispatch';

import { FullScreenLoader } from './loader';
import { Collections } from './agent/collections';

const StackNavigator = createNativeStackNavigator();

const TabScreen = createBottomTabNavigator();

const TabText = ({ focused, children }: { focused: boolean; color: string; children: string }) => (
  <Text fontSize={9} fontWeight={focused ? '500' : 'normal'}>
    {children}
  </Text>
);

const Routes: Router[] = [
  {
    show: true,
    name: ROUTER_FLAG.Lunch,
    component: LunchScreen,
    options: {
      headerShown: false,
    },
  },
  {
    show: true,
    name: ROUTER_FLAG.Login,
    component: LoginScreen,
    options: {
      headerShown: false,
      headerTitleStyle: {
        color: 'rgba(0, 0, 0, 0.85)',
        fontSize: 18,
        fontWeight: 'normal',
      },
    },
  },
  {
    show: true,
    name: ROUTER_FLAG.ForgetPassword,
    component: ForgetPasswordScreen,
    options: {
      headerTransparent: true,
      statusBarTranslucent: true,
      headerTitle: '',
      headerStyle: {
        backgroundColor: 'transparent',
      },
    },
  },
  {
    show: true,
    name: ROUTER_FLAG.SystemSelect,
    component: SystemSelectScreen,
    options: {
      headerTransparent: true,
      statusBarTranslucent: true,
      headerTitle: '',
      headerStyle: {
        backgroundColor: 'transparent',
      },
    },
  },
  {
    show: true,
    name: ROUTER_FLAG.About,
    component: AboutScreen as any,
    options: {
      title: '关于',
    },
  },

  {
    show: true,
    name: ROUTER_FLAG.Setting,
    component: SettingScreen,
    options: {
      title: '设置',
    },
  },
  {
    show: true,
    name: ROUTER_FLAG.Permission,
    component: PermissionScreen,
    options: {
      title: '系统权限管理',
    },
  },
];

const TDRoutes: Router[] = [
  {
    name: ROUTER_FLAG.Me,
    component: MeScreen,
    show: true,
    options: {
      title: '个人中心',
      headerShown: false,
    },
  },
  // {
  //   name: ROUTER_FLAG.Map,
  //   component: MapScreen,
  //   show: true,
  //   options: {
  //     headerShown: false,
  //   },
  // },
  {
    name: ROUTER_FLAG.MapOperationRecord,
    component: MapOperationRecordScreen,
    show: true,
    options: {
      title: '操作记录',
    },
  },
  {
    name: ROUTER_FLAG.Approval,
    component: ApprovalScreen,
    show: true,
    options: {
      title: '审核',
    },
  },
  // 采集任务列表
  {
    name: ROUTER_FLAG.MapCollections,
    component: Collections,
    show: true,
    options: {
      headerShown: false,
    },
  },

  // 点位详情
  {
    name: ROUTER_FLAG.MapPointDetail,
    component: MapPointDetailScreen,
    show: true,
    options: {
      title: '点位详情',
      headerShown: false,
    },
  },

  // 采集任务详情
  {
    name: ROUTER_FLAG.MapCollectionsTaskDetail,
    component: MapCollectionsTaskDetailScreen,
    show: true,
    options: {
      title: '采集任务详情',
      headerShown: false,
    },
  },

  // 采集任务转派
  {
    name: ROUTER_FLAG.TaskDispatch,
    component: TaskDispatchScreen,
    show: true,
    options: {
      title: '转派',
      headerShown: false,
    },
  },

  {
    name: ROUTER_FLAG.MapSearch,
    component: MapSearchScreen,
    show: true,
    options: {
      headerShown: false,
    },
  },

  {
    name: ROUTER_FLAG.MapMarkerLocationInfo,
    component: MapMarkLocationInfoScreen,
    show: true,
    options: {
      title: '钉图采集',
    },
  },
  {
    name: ROUTER_FLAG.MapFastMarkerLocation,
    component: MapFastMarkerLocationScreen,
    show: true,
    options: {
      headerShown: false,
    },
  },

  // 一键拓客
  {
    name: ROUTER_FLAG.ExpandPunter,
    component: ExpandPunterScreen,
    show: true,
    options: {
      title: '一键拓客',
      headerShown: false,
    },
  },
  // 一键拓客-列表
  {
    name: ROUTER_FLAG.ExpandPunterList,
    component: ExpandPunterListScreen,
    show: true,
    options: {
      title: '选择点位',
    },
  },
  // 一键拓客-城市
  {
    name: ROUTER_FLAG.ExpandPunterCity,
    component: ExpandPunterCityScreen,
    show: true,
    options: {
      title: '一键拓客-城市',
      headerShown: false,
    },
  },
  // 拓客-点位列表批量编辑
  {
    name: ROUTER_FLAG.MapPunterBatchEdit,
    component: MapPunterBatchEditScreen,
    show: true,
    options: {
      title: '拓客-点位列表批量编辑',
      headerShown: false,
    },
  },
  // 拓客-点位列表地图选择
  {
    name: ROUTER_FLAG.MapPunterMapSelection,
    component: MapPunterMapSelectionScreen,
    show: true,
    options: {
      title: '拓客-点位列表地图选择',
      headerShown: false,
    },
  },
  // 拓店-审核通过页面
  {
    name: ROUTER_FLAG.ApprovalPass,
    component: ApprovalPass,
    show: true,
    options: {
      title: '确认通过',
    },
  },
  // 拓店-审核不通过页面
  {
    name: ROUTER_FLAG.ApprovalReject,
    component: ApprovalReject,
    show: true,
    options: {
      title: '确认不通过',
    },
  },
  // 拓店-审核驳回页面
  {
    name: ROUTER_FLAG.ApprovalTurnDown,
    component: ApprovalTurnDown,
    show: true,
    options: {
      title: '确认驳回',
    },
  },
];

const CRMRoutes: Router[] = [
  {
    name: ROUTER_FLAG.TelephoneScreen,
    component: TelephoneScreen,
    options: {
      title: '通话助手',
    },
  },
];

const RootScreen = observer(() => {
  const { tabs, routes, type } = useRouter();

  const TabScreens = () => {
    return (
      <TabScreen.Navigator
        id="MainScreen"
        screenOptions={{
          tabBarInactiveTintColor: 'rgba(0, 0, 0, 0.45)',
          tabBarActiveTintColor: '#00BBB4',
          tabBarLabel: TabText,
          headerShadowVisible: false,
        }}
      >
        {tabs.map((tab) => (
          <TabScreen.Screen key={tab.name} name={tab.name!} component={tab.component} options={tab.options ?? {}} />
        ))}
      </TabScreen.Navigator>
    );
  };

  const userStore = useDependency(UserStore);

  return (
    <WatermarkView
      watermark={userStore.userWatermarkText}
      watermarkStyle={{ color: 'rgba(125,125,125, 0.25)', fontSize: 13 }}
      itemWidth={100}
      itemHeight={100}
      rotateZ={20}
    >
      <FullScreenLoader />

      <StackNavigator.Navigator
        screenOptions={{
          gestureEnabled: true,
          animation: 'slide_from_right',
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerBackButtonMenuEnabled: false,
          headerTintColor: 'rgba(0, 0, 0, 0.85)',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 16,
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: '#fff',
          },
        }}
      >
        {type === ApplicationType.CRM ? (
          <StackNavigator.Group>
            {routes.map((v) => (
              <StackNavigator.Screen key={v.name} name={v.name} component={v.component} options={v.options} />
            ))}
          </StackNavigator.Group>
        ) : (
          <StackNavigator.Group>
            {routes.map((v) => {
              return <StackNavigator.Screen key={v.name} name={v.name} component={v.component} options={v.options} />;
            })}
            {tabs.length ? (
              <StackNavigator.Screen name={ROUTER_FLAG.Home} component={TabScreens} options={{ headerShown: false }} />
            ) : null}
          </StackNavigator.Group>
        )}
        <StackNavigator.Screen
          name={ROUTER_FLAG.SchemeLaunch}
          component={SchemeLaunch}
          options={{ header: () => null }}
        />
      </StackNavigator.Navigator>
    </WatermarkView>
  );
});

const linking: LinkingOptions<RootParams> = {
  prefixes: ['tsthelper://'],
  config: {
    initialRouteName: 'SchemeLaunch',
    screens: {
      SchemeLaunch: {
        path: '/scheme-launch',
      },
    },
  },
};
export const RootNavigator = WithAuth((props) => {
  useCookies(Config.APP_ZZ_WEBVIEW_URL);

  const nav = container.resolve<NavigatorType>(NavigatorToken);

  const { permissions, type } = props;

  const tabs: Tab[] = useMemo(() => {
    let defaultTabs: Tab[] = [
      {
        name: ROUTER_FLAG.Home,
        component: HomeScreen,
        options: {
          tabBarLabel: '首页',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              width={20}
              height={22}
              borderRadius="$0.5"
              source={
                focused
                  ? require('@/src/assets/images/tab/home-selected.png')
                  : require('@/src/assets/images/tab/home.png')
              }
            />
          ),
          title: '首页',
          headerShadowVisible: false,
          headerTintColor: 'rgba(0, 0, 0, 0.85)',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 16,
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: 'transparent',
          },
        },
      },
      {
        name: ROUTER_FLAG.Agent,
        component: AgentScreen,
        options: {
          tabBarLabel: '代办',
          // headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              width={20}
              height={22}
              borderRadius="$0.5"
              source={
                focused
                  ? require('@/src/assets/images/tab/agent-selected.png')
                  : require('@/src/assets/images/tab/agent.png')
              }
            />
          ),
          title: '代办',
          headerShadowVisible: false,
          headerTintColor: 'rgba(0, 0, 0, 0.85)',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 16,
            fontWeight: '500',
          },
        },
      },
      {
        name: ROUTER_FLAG.Me,
        component: MeScreen,
        options: {
          tabBarLabel: '我的',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              width={20}
              height={22}
              borderRadius="$0.5"
              source={
                focused ? require('@/src/assets/images/tab/me-selected.png') : require('@/src/assets/images/tab/me.png')
              }
            />
          ),
          headerTransparent: true,
          headerTitle: '我的',
          headerShadowVisible: false,
          headerTintColor: 'rgba(0, 0, 0, 0.85)',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 16,
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: 'transparent',
          },
        },
      },
    ];

    /** 拓店权限 */
    // if (type === ApplicationType.TD) {
    //   defaultTabs = defaultTabs;
    // }

    /** 营运通权限 */
    if (type === ApplicationType.YYT) {
      defaultTabs = defaultTabs
        .filter((v) => ['Home', 'Me'].includes(v.name))
        .map((v) => {
          if (v.name === ROUTER_FLAG.Dashboard) {
            return {
              ...v,
              options: {
                ...v.options,
                tabBarLabel: '首页',
              },
            };
          }
          return v;
        });
    }

    if (type === ApplicationType.CRM) {
      defaultTabs = [];
    }
    console.log('defaultTabs', defaultTabs);

    return defaultTabs;
  }, [type]);

  const routes: Router[] = useMemo(() => {
    let list: Router[] = Routes;
    if (type === ApplicationType.TD) {
      list = Routes.concat(TDRoutes);
    }
    if (type === ApplicationType.CRM) {
      list = Routes.concat(CRMRoutes);
    }
    return list.filter((v) => {
      if (v.show) {
        return true;
      }
      return permissions?.some((p) => {
        if (typeof p === 'boolean') {
          return p;
        }
        return p.url === v.name;
      });
    });
  }, [permissions, type]);

  useEffect(() => {
    if (type === ApplicationType.TD) {
      if (nav.current?.getRootState().routeNames.includes(ROUTER_FLAG.Home)) {
        nav.resetRoot({
          index: 0,
          routes: [{ name: ROUTER_FLAG.Home }],
        });
      }
    } else if (type === ApplicationType.CRM) {
      nav.resetRoot({
        index: 0,
        routes: [{ name: ROUTER_FLAG.TelephoneScreen }],
      });
    }
  }, [nav, type, routes]);

  return (
    <SafeAreaProvider>
      <RNNavigationContainer
        linking={linking}
        fallback={<Loading />}
        ref={NavigatorRef as any}
        onReady={() => {
          SplashScreen?.hide();
        }}
      >
        <RouterContext.Provider value={{ tabs, routes, type }}>
          <RootScreen />
        </RouterContext.Provider>
      </RNNavigationContainer>
    </SafeAreaProvider>
  );
});
