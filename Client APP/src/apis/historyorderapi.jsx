import Taro from "@tarojs/taro";
import { getUserId } from "../utils/auth";

const baseUrl = "http://26.81.202.205:8080";

export const fetchHistoryOrderInfo = async ({
  page = 1,
  pageSize = 5,
  beginTime,
  endTime,
}) => {
  try {
    // 确保参数为数字类型
    const parsedPage = Number(page);
    const parsedPageSize = Number(pageSize);

    // 参数验证
    if (!Number.isInteger(parsedPage) || parsedPage < 1)
      throw new Error("请输入有效的页码");
    if (!Number.isInteger(parsedPageSize) || parsedPageSize < 1)
      throw new Error("请输入有效的每页数量");
    if (beginTime && !Number.isInteger(Number(beginTime)))
      throw new Error("请选择有效的开始时间");
    if (endTime && !Number.isInteger(Number(endTime)))
      throw new Error("请选择有效的结束时间");

    const userId = getUserId();
    console.log("请求参数:", {
      userId,
      page: parsedPage,
      pageSize: parsedPageSize,
      beginTime,
      endTime,
    });

    const response = await Taro.request({
      url: `${baseUrl}/user/list/past`,
      method: "POST",
      data: {
        id: userId,
        page: parsedPage,
        pageSize: parsedPageSize,
        ...(beginTime ? { beginTime: Number(beginTime) } : {}),
        ...(endTime ? { endTime: Number(endTime) } : {}),
      },
      header: { "Content-Type": "application/json" },
    });

    const { data, success, errorMsg } = response.data;
    console.log("API响应:", { success, errorMsg, data });

    if (!success) {
      throw new Error(errorMsg || "获取反馈数据失败，请稍后重试");
    }

    if (data && typeof data === "object") {
      const orderList = data.order || [];
      return {
        list: orderList,
        total: data.total || 0,
        message: orderList.length === 0 ? "暂无反馈数据" : "",
      };
    } else {
      return {
        list: [],
        total: 0,
        message: "暂无反馈数据",
      };
    }
  } catch (error) {
    console.error("获取历史订单失败:", error);
    throw new Error(error.message || "获取反馈数据失败，请稍后重试");
  }
};
