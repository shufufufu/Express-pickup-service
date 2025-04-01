import Taro from '@tarojs/taro';

// 错误类型枚举
const ErrorType = {
  NETWORK: 'NETWORK_ERROR',
  BUSINESS: 'BUSINESS_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTH: 'AUTH_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// 错误消息映射
const ErrorMessages = {
  [ErrorType.NETWORK]: '网络连接异常，请检查网络后重试',
  [ErrorType.BUSINESS]: '服务处理异常，请稍后重试',
  [ErrorType.VALIDATION]: '输入数据有误，请检查后重试',
  [ErrorType.AUTH]: '登录已过期，请重新登录',
  [ErrorType.UNKNOWN]: '系统异常，请稍后重试'
};

// 错误信息脱敏处理
const sanitizeErrorStack = (error) => {
  if (!error) return 'Unknown error';
  
  // 移除可能包含敏感信息的堆栈信息
  const sanitized = {
    name: error.name || 'Error',
    message: error.message,
    type: error.type || ErrorType.UNKNOWN
  };

  // 如果是网络请求错误，只保留状态码和基本信息
  if (error.statusCode) {
    sanitized.statusCode = error.statusCode;
  }

  return sanitized;
};

// 获取用户上下文信息（脱敏）
const getUserContext = () => {
  try {
    return {
      platform: Taro.getSystemInfoSync().platform,
      version: Taro.getSystemInfoSync().version,
      timestamp: Date.now()
    };
  } catch (e) {
    return {};
  }
};

// 获取错误提示消息
const getErrorMessage = (error) => {
  if (!error) return ErrorMessages[ErrorType.UNKNOWN];

  // 处理网络请求错误
  if (error.statusCode) {
    switch (error.statusCode) {
      case 401:
        return ErrorMessages[ErrorType.AUTH];
      case 400:
        return ErrorMessages[ErrorType.VALIDATION];
      case 500:
        return ErrorMessages[ErrorType.BUSINESS];
      default:
        return ErrorMessages[ErrorType.NETWORK];
    }
  }

  // 处理业务错误
  if (error.type && ErrorMessages[error.type]) {
    return ErrorMessages[error.type];
  }

  // 使用错误消息或默认消息
  return error.message || ErrorMessages[ErrorType.UNKNOWN];
};

// 错误上报函数
const reportError = async (errorInfo) => {
  try {
    // 这里可以实现错误上报逻辑，比如发送到日志服务器
    console.log('[Error Report]', errorInfo);
    // 示例：可以通过接口上报到服务器
    // await Taro.request({
    //   url: 'your-error-reporting-endpoint',
    //   method: 'POST',
    //   data: errorInfo
    // });
  } catch (e) {
    console.error('Error reporting failed:', e);
  }
};

// 全局错误处理函数
export const handleError = (error, context = '') => {
  // 错误信息脱敏
  const sanitizedError = sanitizeErrorStack(error);
  
  // 记录错误日志
  console.error(`[${context}] Error:`, sanitizedError);
  
  // 上报错误信息
  reportError({
    type: sanitizedError.type,
    message: sanitizedError.message,
    context,
    timestamp: Date.now(),
    userContext: getUserContext()
  });
  
  // 用户友好的错误提示
  Taro.showToast({
    title: getErrorMessage(error),
    icon: 'none',
    duration: 2000
  });

  // 对于认证错误，可以自动跳转到登录页
  if (sanitizedError.type === ErrorType.AUTH) {
    setTimeout(() => {
      Taro.navigateTo({
        url: '/pages/login/index'
      });
    }, 1500);
  }
};

// 请求错误拦截器
export const requestErrorInterceptor = (error) => {
  // 处理网络错误
  if (!error.statusCode) {
    error.type = ErrorType.NETWORK;
  } else {
    // 处理HTTP状态码错误
    switch (error.statusCode) {
      case 401:
        error.type = ErrorType.AUTH;
        break;
      case 502:
      case 503:
      case 504:
        error.type = ErrorType.NETWORK;
        error.message = '服务器暂时不可用，请稍后重试';
        break;
      case 500:
        error.type = ErrorType.BUSINESS;
        break;
      default:
        if (error.statusCode >= 400 && error.statusCode < 500) {
          error.type = ErrorType.VALIDATION;
        } else {
          error.type = ErrorType.NETWORK;
        }
    }
  }

  // 处理数据结构错误
  if (error.message && error.message.includes('Cannot destructure property')) {
    error.type = ErrorType.BUSINESS;
    error.message = '服务器返回数据格式错误';
  }

  handleError(error, 'API Request');
  return Promise.reject(error);
};