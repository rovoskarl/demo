import { FC, useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import Config from 'react-native-config';

interface Props {
  show: boolean;
  onOk: () => void;
  onCancel: () => void;
}

export const Dialog: FC<Props> = ({ show, onCancel, onOk }) => {
  const [change, setChange] = useState(false);

  return (
    <Modal visible={show} transparent>
      <View className="bg-black/60 flex-1 items-center justify-center">
        <View className="bg-white p-6 mx-8 rounded-xl">
          <Text className="text-base text-[#141414] font-medium">
            是否授权"{Config.APP_NAME}"获取您手机所有文件访问权限
          </Text>
          <View className="mt-6 flex-row justify-between">
            <TouchableOpacity
              onPress={onCancel}
              className="bg-white rounded-md px-10 py-2 border-[0.5px] border-[#DCDCDC]"
            >
              <Text className="text-[#5E5E5E] text-base font-normal">拒绝</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setChange(true);
                if (change) {
                  onCancel();
                } else {
                  onOk();
                }
              }}
              className="bg-primary rounded-md px-10 py-2"
            >
              <Text className="text-white text-base font-semibold">{change ? '已授权' : '允许'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
