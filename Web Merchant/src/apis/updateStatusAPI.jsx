import { http } from "@/utils/index";
import { getRiderId } from "@/utils/index";

const baseUrl = "http://26.81.202.205:8080";

// 统一处理响应
const handleResponse = (response) => {
  return {
    success: response.success,
    errorMsg: response.errorMsg || "",
    data: response.data || null,
  };
};

// 统一处理错误
const handleError = (error) => {
  console.error("请求失败:", error);
  return {
    success: false,
    errorMsg: error.message || "请求失败，请稍后重试",
    data: null,
  };
};

// 除了未接单状态的正常状态更新
export const fetchUpdateStatus = async (params) => {
  const riderId = getRiderId(); // 获取骑手ID
  try {
    const response = await http({
      method: "POST",
      url: `${baseUrl}/shop/changeState`,
      data: {
        deliverId: riderId,
        orderId: params.orderId,
      },
      auth: true, // 需要认证
    });

    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// 未接单状态的正常状态更新（抢单）
export const fetchGrabStatus = async (params) => {
  const riderId = getRiderId();
  try {
    const response = await http({
      method: "POST",
      url: `${baseUrl}/shop/rollOrder`,
      data: {
        deliverId: riderId,
        orderId: params.orderId,
      },
      auth: true, // 需要认证
    });

    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// 拒绝接单
export const fetchRejectStatus = async (params) => {
  const riderId = getRiderId();
  try {
    const response = await http({
      method: "POST",
      url: `${baseUrl}/shop/rejectOrder`,
      data: {
        adminId: riderId, // 注意：这里使用adminId而不是deliverId
        orderId: params.orderId,
      },
      auth: true, // 需要认证
    });

    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// 取件失败
export const fetchPickFail = async (params) => {
  const riderId = getRiderId();
  try {
    const response = await http({
      method: "POST",
      url: `${baseUrl}/shop/pickOrderFailed`,
      data: {
        adminId: riderId, // 注意：这里使用adminId而不是deliverId
        orderId: params.orderId,
      },
      auth: true, // 需要认证
    });

    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};
