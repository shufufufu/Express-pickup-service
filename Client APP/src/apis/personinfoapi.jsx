import Taro from "@tarojs/taro";
import { getUserId } from "../utils/auth";

const baseUrl = "http://8.152.204.181:8080";

export const fetchGetPersonInfo = async () => {
  try {
    const response = await Taro.request({
      url: `${baseUrl}/user/${getUserId()}`,
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
    console.error("Failed to fetch getpersoninfo:", error);
    throw error;
  }
};

export const fetchChangePersonInfo = async (data) => {
  const { userName, age, gender, iphone } = data;
  const userId = getUserId();
  try {
    const response = await Taro.request({
      url: `${baseUrl}/user/updata/info`,
      method: "POST",
      data: {
        id: Number(userId),
        userName: String(userName),
        age: Number(age),
        gender: String(gender),
        iphone: String(iphone),
      }, // 将 除头像外的信息 传给后端
      header: { "Content-Type": "application/json" },
    });
    console.log("后端返回数据", response.data);
    const { success } = response.data;
    if (success) {
      console.log("修改成功");
    } else {
      throw new Error("后端返回的数据格式不正确");
    }
  } catch (error) {
    console.error("Failed to fetch updata:", error);
    throw error;
  }
};
