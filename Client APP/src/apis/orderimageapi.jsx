import Taro from "@tarojs/taro";

const baseUrl = "http://26.81.202.205:8080";

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
      throw new Error('订单号必须是有效数字');
    }

    const res = await Taro.uploadFile({
      url: `${baseUrl}/user/add/order/image`,
      filePath: filePath,
      name: "orderImage", // 文件参数名
      formData: {
        orderId: orderIdNum, // 将验证后的订单号作为附加表单数据
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
