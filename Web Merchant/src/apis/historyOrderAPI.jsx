import { http } from "@/utils/index";
import { getRiderId } from "@/utils/index";

const baseUrl = "http://26.81.202.205:8080";

export const fetchHistoryOrder = async (params = {}) => {
  const riderId = getRiderId(); // 获取骑手ID
  const {
    page = 1,
    pageSize = 20,
    userId,
    deliverId,
    status,
    beginTime,
    endTime,
    orderId,
  } = params;

  try {
    const response = await http({
      method: "POST",
      url: `${baseUrl}/shop/pastOrder`,
      data: {
        userId,
        deliverId,
        orderId,
        status,
        pastQuery: {
          id: riderId,
          page,
          pageSize,
          beginTime,
          endTime,
        },
      },
      auth: true, // 需要认证
    });

    // 确保返回格式正确
    if (response.data && response.data.success) {
      return {
        success: true,
        data: {
          list: response.data.data?.list || [],
          total: response.data.data?.total || 0, // 确保total存在
        },
      };
    } else {
      return {
        success: false,
        errorMsg: response.data?.errorMsg || "获取数据失败",
        data: null,
      };
    }
  } catch (error) {
    // 处理错误
    console.error("获取历史订单失败:", error);

    // 返回统一的错误格式
    return {
      success: false,
      errorMsg: error.message || "获取历史订单失败，请稍后重试",
      data: null,
    };
  }
};
