import Taro from "@tarojs/taro";

const baseUrl = "https://your-backend-url.com";

export const fetchLogin = async (code) => {
  try {
    const response = await Taro.request({
      url: `${baseUrl}/user/login`,
      method: "POST",
      data: { code }, // 将 code 传给后端
      header: { "Content-Type": "application/json" },
    });
    const { token, id } = response.data;
    if (token && id) {
      console.log("登录成功！", { token, id });
      return { token, id };
    } else {
      throw new Error("后端返回的数据格式不正确");
    }
  } catch (error) {
    console.error("Failed to fetch login:", error);
    throw error;
  }
};
