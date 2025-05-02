import { http } from "@/utils/index";
import { getRiderId } from "@/utils/index";

const baseUrl = "http://8.152.204.181:8080";

export const fetchOrder = async (params) => {
  const riderId = getRiderId(); // 获取骑手ID
  try {
    const response = await http({
      method: "POST",
      url: `${baseUrl}/shop/list`,
      data: {
        id: riderId,
        ...params,
      },
      auth: true, // 需要认证
    });
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
