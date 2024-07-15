import crypto from 'crypto-js';
import { inject, singleton } from 'tsyringe';
import { HTTPClientToken } from '@/src/interfaces/client';
import { HTTPClientRepository } from '@/src/client/service';

@singleton()
export class PasswordService {
  constructor(@inject(HTTPClientToken) private _client: HTTPClientRepository) {}

  resetPassword = async (data: { code: string; password: string; phone: string }) => {
    let { password } = data;
    // 密码加密一下
    password = crypto.SHA256(password).toString(crypto.enc.Hex);
    return await this._client.post('user/front/resetPassword', { ...data, identifyCode: data.code, password });
  };

  sendCode = async (phone: string) => {
    return await this._client.post('user/front/sms/send/indentify', { phone, smsTypeEnum: 'SMS_REST_PASSWORD' });
  };

  verifyCode = async (data: { phone: string; code: string }) => {
    return await this._client.post('user/front/sms/check', {
      phone: data.phone,
      identifyCode: data.code,
      smsTypeEnum: 'SMS_REST_PASSWORD',
    });
  };
}
