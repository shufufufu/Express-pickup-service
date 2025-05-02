import { http } from "@/utils/index";
import { getRiderId } from "@/utils/index";

const baseUrl = "/api";

export const fetchRiderInfo = async () => {
  const riderId = getRiderId(); // 获取骑手ID
  try {
    const response = await http({
      method: "GET",
      url: `${baseUrl}/shop/selectDeliverInfo/${riderId}`,

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

export const fetchChangeRiderInfo = async (params) => {
  const riderId = getRiderId(); // 获取骑手ID
  try {
    const response = await http({
      method: "POST",
      url: `${baseUrl}/shop/changeDeliverInfo`,
      data: {
        id: riderId,
        ...params,
      },
      auth: true, // 需要认证
    });

    return response.data;
  } catch (error) {
    // 处理错误
    console.error("提交失败:", error);

    // 返回统一的错误格式
    return {
      success: false,
      errorMsg: error.message || "修改失败，请稍后重试",
      data: null,
    };
  }
};
