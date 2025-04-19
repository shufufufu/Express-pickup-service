import { http } from "@/utils/index";
import { getRiderId } from "@/utils/index";

const baseUrl = "http://26.81.202.205:8080";

//除了未接单状态的正常状态更新
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

    return response.success;
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

//未接单状态的正常状态更新（抢单）
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

    return response.success;
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

//管理员拒绝接单
export const fetchRejectStatus = async (params) => {
  const riderId = getRiderId();
  try {
    const response = await http({
      method: "POST",
      url: `${baseUrl}/shop/rejectOrder`,
      data: {
        adminId: riderId,
        orderId: params.orderId,
      },
      auth: true, // 需要认证
    });

    return response.success;
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

//取件失败
export const fetchPickFail = async (params) => {
  const riderId = getRiderId();
  try {
    const response = await http({
      method: "POST",
      url: `${baseUrl}/shop/pickOrderFailed`,
      data: {
        adminId: riderId,
        orderId: params.orderId,
      },
      auth: true, // 需要认证
    });

    return response.success;
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
