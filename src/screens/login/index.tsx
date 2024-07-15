import { FC, useEffect, useState } from 'react';
import { Switch, Input } from '@/src/components';
import { Image, YStack, XStack, Button, ScrollView, Text, Stack } from 'tamagui';
import { useDependency } from '@/src/ioc';
import { LoginMannerEnum, LoginService } from './service';
import { TouchableOpacity } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { Toast, ToastToken } from '@/src/interfaces/notifications';
import { GlobalStore, UserStore } from '@/src/store';
import { Phone, Account, Password } from '@/src/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Control, Controller, useForm, useWatch } from 'react-hook-form';
import { useCountdown } from '@/src/hooks/useCountDown';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ROUTER_FLAG, RootParams } from '@/src/navigation';
import { alert, dismissAlert } from '@baronha/ting';
import Config from 'react-native-config';

// const ModalCode = ({
//   open,
//   onOpenChange,
//   image,
//   refetch,
//   onConfirm,
// }: {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   image?: string;
//   refetch: () => void;
//   onConfirm: (code: string) => void;
// }) => {
//   const [imageCode, setImageCode] = useState('');

//   return (
//     <Dialog modal open={open} onOpenChange={onOpenChange}>
//       <Dialog.Trigger />
//       <Dialog.Portal>
//         <Dialog.Overlay key="overlay" animation="quick" opacity={0.5} />
//         <Dialog.Content width="80%" bordered elevate key="content" paddingHorizontal="$0" gap="$6">
//           <Dialog.Title marginLeft="$3.5" fontSize={18}>
//             图片验证码
//           </Dialog.Title>
//           <Input
//             backgroundColor="transparent"
//             borderColor="transparent"
//             onChangeText={setImageCode}
//             value={imageCode}
//             placeholder="图形验证码"
//             keyboardType="default"
//             icon={<Code />}
//           >
//             <TouchableWithoutFeedback onPress={() => refetch()}>
//               <Image
//                 resizeMode="contain"
//                 borderRadius="$4"
//                 source={{
//                   width: 96,
//                   height: 48,
//                   uri: image,
//                 }}
//               />
//             </TouchableWithoutFeedback>
//           </Input>
//           <XStack paddingHorizontal="$3.5" alignSelf="flex-end">
//             <Dialog.Close marginRight="$3">
//               <Button onPress={() => onConfirm(imageCode)} backgroundColor="$primaryLight" color="$white">
//                 确定
//               </Button>
//             </Dialog.Close>
//             <Dialog.Close asChild>
//               <Button
//                 onPress={() => {
//                   setImageCode('');
//                 }}
//               >
//                 关闭
//               </Button>
//             </Dialog.Close>
//           </XStack>
//         </Dialog.Content>
//       </Dialog.Portal>
//     </Dialog>
//   );
// };

interface FormValues {
  code?: string;
  phone?: string;
  agreement?: boolean;
}

interface PasswordProps {
  account?: string;
  password?: string;
  code?: string;
  agreement?: boolean;
}

interface SubmitProps {
  control: Control<PasswordProps, any> | Control<FormValues, any>;
  onPress: () => void;
}

type NavigationProps = NativeStackNavigationProp<RootParams, 'WebViewScreen'>;

const SubmitButton: FC<SubmitProps> = ({ onPress, control }) => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <YStack>
      <Controller
        control={control}
        name="agreement"
        render={({ field }) => (
          <XStack marginHorizontal="$6" marginTop="$3">
            <Switch size="small" checked={field.value} onChange={(val) => field.onChange(val)}>
              <Text className="ml-1 text-xs">我已阅读并同意</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(ROUTER_FLAG.WebViewScreen, {
                    url: Config.APP_YY_WEBVIEW_URL + 'privacy.html',
                  });
                }}
                activeOpacity={0.8}
              >
                <Text className="text-primary font-semibold text-xs">《隐私协议》</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(ROUTER_FLAG.WebViewScreen, {
                    title: '用户承诺',
                    url: Config.APP_YY_WEBVIEW_URL + 'promise.html',
                  });
                }}
                activeOpacity={0.8}
              >
                <Text className="text-primary font-semibold text-xs">《软件使用用户承诺》</Text>
              </TouchableOpacity>
            </Switch>
          </XStack>
        )}
      />
      <XStack alignSelf="center">
        <Button
          width={311}
          backgroundColor="$primaryLight"
          color="$white"
          borderRadius="$3.5"
          fontSize={16}
          marginTop="$6"
          height="$4.5"
          onPress={onPress}
        >
          登录
        </Button>
      </XStack>
    </YStack>
  );
};

const PasswordLogin = () => {
  const global = useDependency(GlobalStore);
  const service = useDependency(LoginService);
  const toast = useDependency<Toast>(ToastToken);
  const { control, handleSubmit } = useForm<PasswordProps>();

  // const { data, refetch } = useQuery({
  //   queryKey: ['captcha'],
  //   queryFn: service.getCaptcha,
  // });

  const { mutateAsync: loginByAccount } = useMutation({
    mutationFn: service.loginByAccount,
  });

  const onLoginByAccount = async (values: PasswordProps) => {
    try {
      if (!values?.agreement) {
        toast.show({ message: '请先阅读并同意隐私协议', type: 'error' });
        return;
      }
      const res = await loginByAccount({
        username: values!.account!,
        password: values.password!,
        loginManner: LoginMannerEnum.password,
        // checkCode: values.code!,
        // checkCodeKey: data?.checkCodeKey,
      });
      alert({
        preset: 'spinner',
        title: '',
      });
      global.setToken(res.token);
    } catch (error) {
      dismissAlert();
      console.log('login by account error', error);
    }
  };

  return (
    <YStack>
      <YStack space="$3.5">
        <Controller
          name="account"
          control={control}
          rules={{
            required: { value: true, message: '账号不能为空' },
          }}
          render={({ field, formState: { errors } }) => (
            <Input
              value={field.value}
              onChangeText={field.onChange}
              icon={<Account />}
              placeholder="请输入中台账号"
              errorText={errors.account?.message}
              keyboardType="default"
              maxLength={11}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{
            required: { value: true, message: '密码不能为空' },
          }}
          render={({ field, formState: { errors } }) => (
            <Input
              value={field.value}
              onChangeText={field.onChange}
              icon={<Password />}
              errorText={errors.password?.message}
              placeholder="请输入密码"
              keyboardType="default"
              secureTextEntry={true}
              maxLength={16}
            >
              {/* <Button
                paddingRight="$0"
                onPress={() => navigation.navigate(ROUTER_FLAG.ForgetPassword)}
                chromeless
                color="$primaryLight"
              >
                忘记密码？
              </Button> */}
            </Input>
          )}
        />
        {/* <Controller
          name="code"
          control={control}
          rules={{
            required: { value: true, message: '验证码不能为空' },
          }}
          render={({ field, formState: { errors } }) => (
            <Input
              value={field.value}
              onChangeText={field.onChange}
              errorText={errors.code?.message}
              icon={<Code />}
              placeholder="图形验证码"
              keyboardType="default"
              maxLength={4}
            >
              <TouchableWithoutFeedback onPress={() => refetch()}>
                {data?.url ? (
                  <Image
                    resizeMode="contain"
                    borderRadius="$4"
                    source={{
                      width: 96,
                      height: 46,
                      uri: data?.url,
                    }}
                  />
                ) : (
                  <View className="items-center justify-center">
                    <Text>获取验证码</Text>
                  </View>
                )}
              </TouchableWithoutFeedback>
            </Input>
          )}
        /> */}
      </YStack>
      <SubmitButton control={control} onPress={handleSubmit(onLoginByAccount)} />
    </YStack>
  );
};

const PhoneLogin = () => {
  const { start, countdown, isCountdownActive } = useCountdown(60);

  const { control, handleSubmit } = useForm<FormValues>();

  const global = useDependency(GlobalStore);

  const login = useDependency(LoginService);

  const toast = useDependency<Toast>(ToastToken);

  const phone = useWatch({ control, name: 'phone' });

  const { mutateAsync: sendCode } = useMutation({
    mutationFn: login.getMobileVerificationCode,
  });

  const { mutateAsync: loginByPhone } = useMutation({
    mutationFn: login.loginByPhone,
  });

  const onLoginByPhone = async (values: FormValues) => {
    try {
      if (!values?.agreement) {
        toast.show({ message: '请先阅读并同意隐私协议', type: 'error' });
        return;
      }
      const res = await loginByPhone({
        mobile: values!.phone, //手机号
        loginType: 'SMS_LOGIN', //登录类型
        securityCode: values!.code, //手机验证码
        loginManner: LoginMannerEnum.sms,
      });
      alert({
        preset: 'spinner',
        title: '',
      });
      global.setToken(res);
    } catch (error) {
      dismissAlert();
      console.log('login by phone error', error);
    }
  };

  const onSendCode = async () => {
    try {
      if (isCountdownActive) {
        return;
      }
      if (!phone) {
        toast.show({ message: '手机号不能为空', type: 'error' });
        return;
      }
      await sendCode({
        mobile: phone,
      });
      start();
    } catch (e) {
      console.log('send code error', e);
    }
  };

  return (
    <YStack>
      <YStack space="$3.5">
        <Controller
          name="phone"
          control={control}
          rules={{
            required: { value: true, message: '手机号不能为空' },
            pattern: {
              value: /^1[3456789]\d{9}$/,
              message: '手机号格式不正确',
            },
          }}
          render={({ field, formState: { errors } }) => (
            <Input
              maxLength={11}
              icon={<Phone />}
              value={field.value}
              onChangeText={field.onChange}
              placeholder="请输入手机号"
              errorText={errors.phone?.message}
            />
          )}
        />
        <Controller
          name="code"
          control={control}
          rules={{
            required: { value: true, message: '验证码不能为空' },
          }}
          render={({ field, formState: { errors } }) => (
            <Input
              keyboardType="default"
              value={field.value}
              onChangeText={field.onChange}
              icon={<Password />}
              placeholder="请输入验证码"
              errorText={errors.code?.message}
              maxLength={5}
            >
              <Button
                paddingRight="$0"
                onPress={onSendCode}
                pressStyle={{
                  backgroundColor: 'transparent',
                  borderColor: 'transparent',
                }}
                chromeless
                color="$primaryLight"
              >
                {isCountdownActive ? `${countdown}秒后重发` : '获取验证码'}
              </Button>
            </Input>
          )}
        />
      </YStack>
      <SubmitButton control={control} onPress={handleSubmit(onLoginByPhone)} />
    </YStack>
  );
};

export const LoginScreen = () => {
  const { top } = useSafeAreaInsets();

  const { resetUser } = useDependency(UserStore);

  const [isSwitch, setSwitch] = useState(false);

  useEffect(() => {
    resetUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView flex={1} backgroundColor="$white">
      <Image position="absolute" top={0} width="100%" height={200} source={require('@/src/assets/images/bg.png')} />
      <Stack marginTop={top} height="$4.5" justifyContent="center" alignItems="center">
        <Text alignSelf="center" color="$black8Light" fontSize={18} fontWeight="500">
          塔塔工作台
        </Text>
      </Stack>
      <YStack marginVertical={48} alignSelf="center">
        <Image source={require('@/src/assets/images/logo.png')} />
      </YStack>
      <YStack>{isSwitch ? <PhoneLogin /> : <PasswordLogin />}</YStack>
      <YStack alignSelf="center">
        <Button onPress={() => setSwitch(!isSwitch)} fontSize={14} marginTop="$2.5" chromeless color="$primaryLight">
          {isSwitch ? '账号密码登录' : '短信验证码登录'}
        </Button>
      </YStack>
    </ScrollView>
  );
};
