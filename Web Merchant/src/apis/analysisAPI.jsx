import { http } from "@/utils/index";

const baseUrl = "http://8.152.204.181:8080";

export const fetchAnalysisData = async (timeRange) => {
  // 将时间范围转换为对应的状态码
  let id;
  switch (timeRange) {
    case "week":
      id = 0; // 近一周
      break;
    case "month":
      id = 1; // 近一个月
      break;
    case "quarter":
      id = 2; // 近三个月
      break;
    case "halfYear":
      id = 3; // 近半年
      break;
    default:
      id = 0; // 默认近一周
  }

  try {
    const response = await http({
      method: "GET",
      url: `${baseUrl}/shop/slectFlowingWater/${id}`,
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
