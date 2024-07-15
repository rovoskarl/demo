import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { Header } from '@/src/components';
import { observer } from 'mobx-react-lite';
import { useDependency } from '@/src/ioc';
import { GlobalStore, Role, UserStore } from '@/src/store';

import { View, Text, Image } from 'react-native';
import { ApplicationType, ApplicationTypeName } from '@/src/interfaces/role';

const images: { [key in any]: any } = {
  [ApplicationType.ZZ]: require('@/src/assets/images/system/zzxz.png'),
  [ApplicationType.TD]: require('@/src/assets/images/system/tdzs.png'),
  [ApplicationType.CRM]: require('@/src/assets/images/system/telephone.png'),
  CORP: require('@/src/assets/images/system/yyt-corp.png'),
  SHOP: require('@/src/assets/images/system/yyt-shop.png'),
};
type ItemProps = {
  type: ApplicationType;
  title: string;
  role?: Role;
  onPress?: (type: ApplicationType, role?: Role) => void;
};

const Item = ({ type, title, role, onPress }: ItemProps) => {
  return (
    <TouchableWithoutFeedback className="items-center justify-center" onPress={() => onPress?.(type, role)}>
      <Image resizeMode="contain" source={role ? images[role] : images[type]} />
      <Text className="mt-2 text-sm font-normal text-[#141414]">{title}</Text>
      {role ? <Text className="text-xs mt-1 text-[#858585]">{role !== 'SHOP' ? '公司员工' : '门店员工'}</Text> : null}
    </TouchableWithoutFeedback>
  );
};

export const SystemSelectScreen = observer(() => {
  const user = useDependency(UserStore);
  const global = useDependency(GlobalStore);

  const handleRoleSelect = async (type: ApplicationType, role?: Role) => {
    global.setApplication(type);
    role && user.setCurIdentify(role);
  };

  return (
    <View className="flex-1 bg-white">
      <Header title="系统入口" subTitle="请选择您要进入的操作系统" left={32} />
      <View
        style={{
          gap: 32,
        }}
        className="px-9 flex-row flex-wrap"
      >
        {global.applicationList.map((item) => {
          if (item === ApplicationType.YYT && user.roleList.length) {
            return user.roleList.map((role) => (
              <Item key={role} type={item} title={ApplicationTypeName[item]} role={role} onPress={handleRoleSelect} />
            ));
          }
          return <Item key={item} type={item} title={ApplicationTypeName[item]} onPress={handleRoleSelect} />;
        })}
      </View>
    </View>
  );
});
