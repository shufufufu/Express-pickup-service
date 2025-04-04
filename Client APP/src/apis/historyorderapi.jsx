import Taro from "@tarojs/taro";
import { getUserId } from "../utils/auth";

const baseUrl = "http://26.81.202.205:8080";

export const fetchHistoryOrderInfo = async ({ page = 1, pageSize = 5, beginTime, endTime }) => {
  try {
    // 确保参数为数字类型
    const parsedPage = Number(page);
    const parsedPageSize = Number(pageSize);
    
    // 参数验证
    if (!Number.isInteger(parsedPage) || parsedPage < 1) throw new Error('页码必须是大于0的整数');
    if (!Number.isInteger(parsedPageSize) || parsedPageSize < 1) throw new Error('每页数量必须是大于0的整数');
    if (beginTime && !Number.isInteger(Number(beginTime))) throw new Error('开始时间必须是时间戳格式');
    if (endTime && !Number.isInteger(Number(endTime))) throw new Error('结束时间必须是时间戳格式');

    const userId = getUserId();
    console.log('请求参数:', { userId, page: parsedPage, pageSize: parsedPageSize, beginTime, endTime });

    const response = await Taro.request({
      url: `${baseUrl}/user/list/past`,
      method: "POST",
      data: { 
        userId,
        page: parsedPage,
        pageSize: parsedPageSize,
        ...(beginTime ? { beginTime: Number(beginTime) } : {}),
        ...(endTime ? { endTime: Number(endTime) } : {})
      },
      header: { "Content-Type": "application/json" },
    });

    const { data, success, errorMsg } = response.data;
    console.log('API响应:', { success, errorMsg, data });

    if (!success) {
      throw new Error(errorMsg || '请求失败');
    }

    if (Array.isArray(data)) {
      return { list: data };
    } else {
      throw new Error("后端返回的数据格式不正确");
    }
  } catch (error) {
    console.error("Failed to fetch historyorder:", error);
    throw error;
  }
};
