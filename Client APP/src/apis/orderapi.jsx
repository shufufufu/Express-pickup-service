import Taro from "@tarojs/taro";
import { getUserId } from "../utils/auth";

const baseUrl = "http://8.152.204.181:8080";

export const fetchOrder = async () => {
  const userId = getUserId(); // 获取用户ID
  try {
    const response = await Taro.request({
      url: `${baseUrl}/user/order/list/${userId}`,
      method: "GET",
      header: { "Content-Type": "application/json" },
    });
    const { data } = response.data;
    if (data) {
      return { data };
    } else {
      throw new Error("后端返回的数据格式不正确");
    }
  } catch (error) {
    console.error("Failed to fetch order:", error);
    throw error;
  }
};
