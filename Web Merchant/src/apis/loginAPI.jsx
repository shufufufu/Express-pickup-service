import { http } from "@/utils/index";

const baseUrl = "http://8.152.204.181:8080";

/**
 * 用户登录
 * @param {Object} params - 登录参数
 * @param {string} params.account - 账号
 * @param {string} params.password - 密码
 * @returns {Promise<Object>} - 返回登录结果
 */
export const fetchLogin = async (params) => {
  try {
    const response = await http({
      method: "POST",
      url: `${baseUrl}/shop/login`,
      data: params,
      auth: false, // 不需要认证
    });

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
