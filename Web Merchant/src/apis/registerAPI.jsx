import { http } from "@/utils/index";
import { useUserStore } from "@/store/useUserStore";

const baseUrl = "http://8.152.204.181:8080";

/**
 * 用户登录
 * @param {Object} params - 登录参数
 * @param {string} params.account - 账号
 * @param {string} params.password - 密码
 * @param {string} params.cerate - 密码
 * @returns {Promise<Object>} - 返回登录结果
 */
export const fetchRegister = async (params) => {
  try {
    const response = await http({
      method: "POST",
      url: `${baseUrl}/shop/register`,
      data: params,
      auth: false, // 不需要认证
    });

    // 返回响应数据
    console.log(response.data);

    return response.data;
  } catch (error) {
    // 处理错误
    console.error("登录失败:", error);

    // 返回统一的错误格式
    return {
      success: false,
      errorMsg: error.message || "登录失败，请稍后重试",
      data: null,
    };
  }
};

export const fetchDToken = async () => {
  const store = useUserStore.getState();

  // 检查是否可以请求新的动态令牌
  if (!store.canRequestNewDynamicToken()) {
    return {
      success: false,
      errorMsg: "动态令牌仍在有效期内，请稍后再试",
      data: store.dynamicToken,
    };
  }

  //const riderId = getRiderId(); // 获取骑手ID
  try {
    const response = await http({
      method: "GET",
      url: `${baseUrl}/shop/create`,
      auth: true, // 需要认证
    });
    if (response.data) {
      // 存储新的动态令牌
      store.setDynamicToken(response.data.data);
    }

    return response.data;
  } catch (error) {
    // 处理错误
    console.error("获取失败:", error);

    // 返回统一的错误格式
    return {
      success: false,
      errorMsg: error.message || "获取失败，请稍后重试",
      data: null,
    };
  }
};
