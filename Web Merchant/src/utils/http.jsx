import { getToken } from "@/utils";
/**
 * 封装的 HTTP 客户端，使用方式类似 Axios
 * @param {Object} config - 请求配置
 * @returns {Promise} - 返回处理后的响应数据
 */
export async function http(config) {
  try {
    // 设置默认值和解构
    const {
      url,
      method = "GET",
      params,
      data,
      headers = {},
      auth = true,
      responseType = "json",
      timeout = 5000,
      baseURL = "",
      withCredentials = true,
      validateStatus = (status) => status >= 200 && status < 300,
    } = config;

    if (!url) {
      throw new Error("URL 是必需的");
    }

    // 构建完整 URL
    let fullUrl = baseURL ? `${baseURL}${url}` : url;

    // 处理查询参数
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      fullUrl = `${fullUrl}${fullUrl.includes("?") ? "&" : "?"}${queryString}`;
    }

    // 构建请求配置
    const fetchConfig = {
      method: method.toUpperCase(),
      headers: {
        // 默认请求头
        Accept: "application/json",
        ...headers,
      },
      // 包含凭证（cookies）
      credentials: withCredentials ? "include" : "same-origin",
    };

    // 添加认证头（如果需要）
    if (auth) {
      const token = localStorage.getItem("authToken");
      if (token) {
        fetchConfig.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    // 处理请求体
    if (data) {
      if (data instanceof FormData) {
        // 如果是 FormData，不设置 Content-Type，让浏览器自动设置
        fetchConfig.body = data;
      } else {
        fetchConfig.headers["Content-Type"] = "application/json";
        fetchConfig.body = JSON.stringify(data);
      }
    }

    // 处理超时
    let timeoutId;
    const fetchPromise = fetch(fullUrl, fetchConfig);

    let response;

    if (timeout) {
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error(`请求超时: ${timeout}ms`));
        }, timeout);
      });

      // 使用 Promise.race 实现超时控制
      response = await Promise.race([fetchPromise, timeoutPromise]);
      clearTimeout(timeoutId);
    } else {
      // 无超时控制的请求
      response = await fetchPromise;
    }

    // 创建响应对象
    const responseObject = {
      data: null,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      config,
      request: response,
    };

    // 检查响应状态
    if (!validateStatus(response.status)) {
      const error = new Error(
        response.statusText || `请求失败，状态码: ${response.status}`
      );
      error.response = responseObject;
      throw error;
    }

    // 解析响应数据
    responseObject.data = await parseResponse(response, responseType);

    return responseObject;
  } catch (error) {
    // 增强错误对象
    if (!error.response) {
      error.isNetworkError = true;
      error.config = config;
    }

    // 记录错误
    console.error("HTTP 请求错误:", error);

    // 重新抛出错误，让调用者处理
    throw error;
  }
}

/**
 * 根据指定的类型解析响应
 * @param {Response} response - fetch 响应对象
 * @param {string} type - 响应类型
 * @returns {Promise} - 解析后的响应
 */
async function parseResponse(response, type) {
  switch (type) {
    case "json": {
      // 处理空响应
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    }
    case "text":
      return await response.text();
    case "blob":
      return await response.blob();
    case "arrayBuffer":
      return await response.arrayBuffer();
    case "formData":
      return await response.formData();
    default:
      return await response.json();
  }
}

// 添加便捷方法
http.get = (url, config = {}) => http({ ...config, url, method: "GET" });
http.post = (url, data, config = {}) =>
  http({ ...config, url, method: "POST", data });
http.put = (url, data, config = {}) =>
  http({ ...config, url, method: "PUT", data });
http.delete = (url, config = {}) => http({ ...config, url, method: "DELETE" });
http.patch = (url, data, config = {}) =>
  http({ ...config, url, method: "PATCH", data });

// 创建实例方法（类似 axios.create）
http.create = (defaultConfig = {}) => {
  const instance = (config) => http({ ...defaultConfig, ...config });

  // 为实例添加便捷方法
  instance.get = (url, config = {}) =>
    instance({ ...config, url, method: "GET" });
  instance.post = (url, data, config = {}) =>
    instance({ ...config, url, method: "POST", data });
  instance.put = (url, data, config = {}) =>
    instance({ ...config, url, method: "PUT", data });
  instance.delete = (url, config = {}) =>
    instance({ ...config, url, method: "DELETE" });
  instance.patch = (url, data, config = {}) =>
    instance({ ...config, url, method: "PATCH", data });

  return instance;
};

// 添加拦截器功能
const interceptors = {
  request: {
    handlers: [],
    use: (fulfilled, rejected) => {
      interceptors.request.handlers.push({ fulfilled, rejected });
    },
  },
  response: {
    handlers: [],
    use: (fulfilled, rejected) => {
      interceptors.response.handlers.push({ fulfilled, rejected });
    },
  },
};

http.interceptors = interceptors;

// 添加 token 注入拦截器
http.interceptors.request.use(
  (config) => {
    // 如果需要认证
    if (config.auth !== false) {
      // 使用 getToken 函数获取 token
      const token = getToken();

      if (token) {
        // 确保 headers 对象存在
        config.headers = config.headers || {};

        // 添加认证头
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
