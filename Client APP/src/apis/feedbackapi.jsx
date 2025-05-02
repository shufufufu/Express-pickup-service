import Taro from "@tarojs/taro";
import { getUserId } from "../utils/auth";
const baseUrl = "http://8.152.204.181:8080";

export const fetchFeedback = async (content) => {
  const userId = getUserId();
  try {
    const response = await Taro.request({
      url: `${baseUrl}/user/feedback`,
      method: "POST",
      data: { userId, content }, // 将 userId,content 传给后端
      header: { "Content-Type": "application/json" },
    });
    const { success } = response.data;
    if (success) {
      console.log("反馈成功", { success });
    } else {
      throw new Error("后端返回的数据格式不正确");
    }
  } catch (error) {
    console.error("Failed to fetch feedback:", error);
    throw error;
  }
};
