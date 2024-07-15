import { FC, useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { Control, UseFormHandleSubmit, UseFormSetValue, useController, useForm, useWatch } from 'react-hook-form';

import { Header, HeaderBackButton, Input } from '@/src/components';
import { NextButton } from './components/Button';
import { VerificationCode } from './components/VerificationCode';
import { Password, Phone } from '@/src/icons';

import { Button, YStack } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { useDependency } from '@/src/ioc';
import { PasswordService } from './service';
import { useMutation } from '@tanstack/react-query';
import { useCountdown } from '@/src/hooks/useCountDown';

type ScreenType = 'enterPhone' | 'typeCaptcha' | 'resetPassword';

type FormData = {
  phone: string;
  code: string;
  oldPassword: string;
  password: string;
  type: ScreenType;
};

interface Props {
  control?: Control<FormData, any>;
  setValue?: UseFormSetValue<FormData>;
  handleResetPassword?: UseFormHandleSubmit<FormData, undefined>;
}

const EnterPhone: FC<Props> = ({ control, setValue, handleResetPassword }) => {
  const service = useDependency(PasswordService);

  const { mutateAsync: sendCode } = useMutation({
    mutationFn: service.sendCode,
  });

  const {
    field,
    formState: { errors },
  } = useController<FormData>({
    control,
    name: 'phone',
    rules: {
      required: true,
      pattern: {
        value: /^1[3456789]\d{9}$/,
        message: '请输入正确的手机号',
      },
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await sendCode(data.phone);
      setValue?.('type', 'typeCaptcha');
    } catch (error) {
      console.log('send code error', error);
    }
  };

  const disabled = useMemo(() => {
    return !field.value || !!errors?.phone?.message;
  }, [field.value, errors?.phone?.message]);

  return (
    <YStack>
      <Header left={32} title="忘记密码" subTitle="使用手机号码找回密码" />
      <Input
        icon={<Phone />}
        value={field.value}
        onChangeText={field.onChange}
        placeholder="请输入手机号"
        errorText={errors?.phone?.message}
      />
      <NextButton disabled={disabled} onPress={handleResetPassword?.(onSubmit)} />
    </YStack>
  );
};

const TypeCaptcha: FC<Props> = ({ control, setValue, handleResetPassword }) => {
  const { start, isCountdownActive, countdown } = useCountdown(60);

  const service = useDependency(PasswordService);

  const { mutateAsync: sendCode } = useMutation({
    mutationFn: service.sendCode,
  });

  const { mutateAsync: checkCode } = useMutation({
    mutationFn: service.verifyCode,
  });

  const phone = useWatch({
    control,
    name: 'phone',
  });

  useEffect(() => {
    start();
  }, [start]);

  const send = useCallback(async () => {
    try {
      start();
      await sendCode(phone);
    } catch (error) {
      console.log('send code error', error);
    }
  }, [phone, sendCode, start]);

  const {
    field,
    formState: { errors },
  } = useController<FormData>({
    control,
    name: 'code',
    rules: {
      required: true,
      pattern: {
        value: /^\d{4}$/,
        message: '请输入正确的验证码',
      },
    },
  });

  const onSubmit = async () => {
    try {
      const res = await checkCode({
        phone,
        code: field.value,
      });
      console.log(res, 'res');
      setValue?.('type', 'resetPassword');
    } catch (error) {
      console.log('check code', error);
    }
  };

  const disabled = useMemo(() => {
    return !!errors?.code?.message || !field.value;
  }, [errors?.code?.message, field.value]);

  return (
    <YStack>
      <Header left={32} title="输入验证码" subTitle={`已发送 4 位验证码至 +${phone}`} />
      <VerificationCode value={field.value} onChangeText={field.onChange} />
      <NextButton disabled={disabled} onPress={handleResetPassword?.(onSubmit)} title="确定" />
      <Button disabled={isCountdownActive} onPress={send} chromeless color="$primaryLight">
        {!isCountdownActive ? '重新获取验证码' : `重新获取验证码(${countdown})`}
      </Button>
    </YStack>
  );
};

const ResetPassword: FC<Props> = ({ control, handleResetPassword }) => {
  const navigation = useNavigation();
  const service = useDependency(PasswordService);

  const { mutateAsync: resetPassword } = useMutation({
    mutationFn: service.resetPassword,
  });

  const { field } = useController<FormData>({
    control,
    name: 'password',
    rules: {
      required: true,
      pattern: {
        value: /^(?=.*\d)(?=.*[a-z]).{6,16}$/,
        message: '密码是由大小写和数字组成的6-15位字符',
      },
    },
  });

  const {
    field: oldPassword,
    formState: { errors },
  } = useController<FormData>({
    control,
    name: 'oldPassword',
    rules: {
      required: true,
      validate: (value) => {
        if (value !== field.value) {
          return '两次密码输入不一致';
        }
      },
    },
  });

  const disabled = useMemo(() => {
    return !!errors?.password?.message || !!errors?.oldPassword?.message || !field.value || !oldPassword.value;
  }, [errors?.oldPassword?.message, errors?.password?.message, field.value, oldPassword.value]);

  const onSubmit = (data: FormData) => {
    try {
      console.log(data, 'data');
      const res = resetPassword({
        code: data.code,
        phone: data.phone,
        password: data.password,
      });
      navigation.goBack();
      console.log(res, 'res');
    } catch (error) {
      console.log('reset password', error);
    }
  };

  return (
    <YStack>
      <Header left={32} title="重置密码" subTitle="设置成功后即完成密码修改" />
      <YStack space="$3.5">
        <Input
          icon={<Password />}
          value={field.value}
          onChangeText={field.onChange}
          placeholder="请输入新密码"
          errorText={errors?.password?.message}
          keyboardType="default"
          secureTextEntry
        />
        <Input
          icon={<Password />}
          value={oldPassword.value}
          onChangeText={oldPassword.onChange}
          placeholder="请再次输入新密码"
          errorText={errors?.oldPassword?.message}
          keyboardType="default"
          secureTextEntry
        />
      </YStack>
      <NextButton disabled={disabled} onPress={handleResetPassword?.(onSubmit)} title="完成" />
    </YStack>
  );
};

export const ForgetPasswordScreen = () => {
  const navigation = useNavigation();

  const { control, handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      type: 'enterPhone',
    },
  });

  const type = watch('type');

  const onBack = useCallback(() => {
    switch (type) {
      case 'enterPhone':
        navigation.goBack();
        break;
      case 'typeCaptcha':
        setValue('type', 'enterPhone');
        break;
      case 'resetPassword':
        setValue('type', 'typeCaptcha');
        break;
    }
  }, [navigation, setValue, type]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderBackButton onPress={onBack} />,
    });
  }, [navigation, onBack]);

  const renderScreen = () => {
    switch (type) {
      case 'enterPhone':
        return <EnterPhone control={control} setValue={setValue} handleResetPassword={handleSubmit} />;
      case 'typeCaptcha':
        return <TypeCaptcha control={control} setValue={setValue} handleResetPassword={handleSubmit} />;
      case 'resetPassword':
        return <ResetPassword control={control} handleResetPassword={handleSubmit} />;
      default:
        return <EnterPhone control={control} setValue={setValue} handleResetPassword={handleSubmit} />;
    }
  };

  return (
    <YStack flex={1} backgroundColor="$white">
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" animated />
      {renderScreen()}
    </YStack>
  );
};
