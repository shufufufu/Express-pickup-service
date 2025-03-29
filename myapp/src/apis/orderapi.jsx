import Taro from "@tarojs/taro";
import { getUserId } from "../utils/auth";

const baseUrl = "http://26.81.202.205:8080";

export const fetchOrder = async () => {
  try {
    const response = await Taro.request({
      url: `${baseUrl}/user/order/list/${getUserId()}`,
      method: "GET",
      header: { "Content-Type": "application/json" },
    });
    const { data } = response.data;
    console.log("获取订单数据为：",  response.data );
    if (data) {
      console.log("获取订单成功！", { data });
      return { data };
    } else {
      throw new Error("后端返回的数据格式不正确");
    }
  } catch (error) {
    console.error("Failed to fetch order:", error);
    throw error;
  }
};
