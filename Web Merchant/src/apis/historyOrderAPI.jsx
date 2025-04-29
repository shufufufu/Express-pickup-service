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

    // 直接返回后端的响应结构，不做转换
    console.log("获取历史订单成功:", response.data);
    return response.data;
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

export const fetchPHistoryOrder = async (params = {}) => {
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
      url: `${baseUrl}/shop/myolist`,
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

    // 直接返回后端的响应结构，不做转换
    return response.data;
  } catch (error) {
    // 处理错误
    console.error("获取个人历史订单失败:", error);

    // 返回统一的错误格式
    return {
      success: false,
      errorMsg: error.message || "获取个人历史订单失败，请稍后重试",
      data: null,
    };
  }
};
