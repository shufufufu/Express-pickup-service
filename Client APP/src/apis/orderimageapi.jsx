import Taro from "@tarojs/taro";

const baseUrl = "http://8.152.204.181:8080";

/**
 * 上传订单图片并关联订单号
 * @param {string} filePath - 图片临时路径
 * @param {string} orderId - 订单号
 * @returns {Promise} 返回上传结果
 */
export const fetchOrderImages = async (filePath, orderId) => {
  try {
    // 验证orderId是否为有效数字
    const orderIdNum = Number(orderId);
    if (isNaN(orderIdNum) || !orderId) {
      throw new Error("订单号必须是有效数字");
    }

    const res = await Taro.uploadFile({
      url: `${baseUrl}/user/add/order/image`,
      filePath: filePath,
      name: "orderImage", // 文件参数名
      formData: {
        orderId: orderIdNum, // 将验证后的订单号作为附加表单数据
      },
    });

    // 检查HTTP状态码
    if (res.statusCode !== 200) {
      throw new Error(`服务器返回错误状态码: ${res.statusCode}`);
    }

    // 输出原始响应数据以便调试
    console.log("服务器原始响应:", res.data);

    let data;
    try {
      // 检查res.data是否已经是对象
      if (typeof res.data === "object") {
        data = res.data;
      } else {
        data = JSON.parse(res.data);
      }
    } catch (e) {
      console.error("数据解析错误，原始数据:", res.data);
      throw new Error("返回数据解析失败");
    }

    if (!data.success) {
      throw new Error(data.errorcheck || data.message || "后端返回失败");
    }

    return data;
  } catch (error) {
    console.error("上传失败:", error);
    // 添加更多错误信息
    if (error.message.includes("返回数据解析失败")) {
      throw new Error(`图片上传失败: ${error.message}，请联系技术支持`);
    } else {
      throw new Error(`图片上传失败: ${error.message}`);
    }
  }
};
