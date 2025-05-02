import Taro from "@tarojs/taro";
import { getUserId } from "../utils/auth";

const baseUrl = "http://8.152.204.181:8080";

/**
 * 上传订单图片并关联订单号
 * @param {string} filePath - 图片临时路径
 * @param {number} userId - userId
 * @returns {Promise} 返回上传结果
 */
export const fetchUserImages = async (filePath) => {
  try {
    const userId = getUserId();

    const res = await Taro.uploadFile({
      url: `${baseUrl}/user/add/image`,
      filePath: filePath,
      name: "userImage", // 文件参数名
      formData: {
        userId: Number(userId), // 将验证后的用户id作为附加表单数据
      },
    });

    let data;
    try {
      data = JSON.parse(res.data);
    } catch (e) {
      throw new Error("返回数据解析失败");
    }

    if (!data.success) {
      throw new Error(data.errorcheck || "后端返回失败");
    }

    return data;
  } catch (error) {
    console.error("上传失败:", error);
    throw new Error(`图片上传失败: ${error.message}`);
  }
};
