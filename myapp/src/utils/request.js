import Taro from '@tarojs/taro';
import { getToken } from './auth';

// 请求拦截器
export const request = async (options) => {
  const token = getToken();
  
  // 添加请求签名
  const timestamp = Date.now();
  const nonce = Math.random().toString(36).substr(2);
  const signature = generateSignature(options.data, timestamp, nonce);
  
  // 判断是否为登录接口
  const isLoginRequest = options.url.includes('login');
  
  const finalOptions = {
    ...options,
    header: {
      ...options.header,
      'Authorization': !isLoginRequest && token ? `Bearer ${token}` : '',
      'X-Timestamp': timestamp,
      'X-Nonce': nonce,
      'X-Signature': signature,
    }
  };
  
  try {
    const response = await Taro.request(finalOptions);
    // 验证响应签名
    if (!verifyResponseSignature(response)) {
      throw new Error('响应签名验证失败');
    }
    return response;
  } catch (error) {
    handleRequestError(error);
    throw error;
  }
};