import { http } from "@/utils/index";
import { getRiderId } from "@/utils/index";

const baseUrl = "/api";

export const fetchOrder = async (params) => {
  const riderId = getRiderId(); // 获取骑手ID
  const { page, pageSize } = params;
  console.log("获取订单请求参数:", { page, pageSize });
  try {
    const response = await http({
      method: "POST",
      url: `${baseUrl}/shop/list`,
      data: {
        id: riderId,
        page: page,
        pageSize: pageSize,
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
