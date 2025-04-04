import Taro from "@tarojs/taro";

const baseUrl = "http://26.81.202.205:8080";

export const fetchRider = async (riderId) => {
  try {
    const response = await Taro.request({
      url: `${baseUrl}/user/order/deliver/${riderId}`,
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
    console.error("Failed to fetch rider:", error);
    throw error;
  }
};
