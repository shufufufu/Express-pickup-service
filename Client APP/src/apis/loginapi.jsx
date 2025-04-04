import Taro from "@tarojs/taro";

const baseUrl = "http://26.81.202.205:8080";

export const fetchLogin = async (code) => {
  try {
    const response = await Taro.request({
      url: `${baseUrl}/user/login`,
      method: "POST",
      data: { code }, // 将 code 传给后端
      header: { "Content-Type": "application/json" },
    });
    const { id, token } = response.data.data;
    if (token && id) {
      return { token, id };
    } else {
      throw new Error("后端返回的数据格式不正确");
    }
  } catch (error) {
    console.error("Failed to fetch login:", error);
    throw error;
  }
};
