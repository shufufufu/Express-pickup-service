import { http } from "@/utils/index";
import { getRiderId } from "@/utils/index";

const baseUrl = "http://8.152.204.181:8080";
const riderId = getRiderId(); // 获取骑手ID
//发布公告接口
export const fetchReleaseBroadcast = async (params) => {
  const { title, content, startTime, endTime } = params;
  console.log("获取评论请求参数:", { title, content, startTime, endTime });
  try {
    const response = await http({
      method: "POST",
      url: `${baseUrl}/shop/addBroadcast`,
      data: {
        deliverId: riderId,
        title: title,
        content: content,
        startTime: startTime,
        endTime: endTime,
      },
      auth: true, // 需要认证
    });

    return response.data;
  } catch (error) {
    // 处理错误
    console.error("获取失败:", error);

    // 返回统一的错误格式
    return {
      success: false,
      errorMsg: error.message || "获取失败，请稍后重试",
      data: null,
    };
  }
};

//获取历史公告接口（后台）
export const fetchHistoryBroadcast = async (params) => {
  const { page, pageSize } = params;
  try {
    const response = await http({
      method: "GET",
      url: `${baseUrl}/shop/select/broadcast/${page}/${pageSize}`,
      auth: true, // 需要认证
    });
    return response.data;
  } catch (error) {
    // 处理错误
    console.error("获取失败:", error);

    // 返回统一的错误格式
    return {
      success: false,
      errorMsg: error.message || "获取失败，请稍后重试",
      data: null,
    };
  }
};

//删除公告
export const fetchDeleteBroadcast = async (params) => {
  const { id } = params;
  try {
    const response = await http({
      method: "DELETE",
      url: `${baseUrl}/shop/delete/broadcast/${id}/${riderId}`,
      auth: true, // 需要认证
    });

    return response.data;
  } catch (error) {
    // 处理错误
    console.error("获取失败:", error);

    // 返回统一的错误格式
    return {
      success: false,
      errorMsg: error.message || "获取失败，请稍后重试",
      data: null,
    };
  }
};

//编辑修改公告
export const fetchEditBroadcast = async (params) => {
  const { id, title, content, startTime, endTime } = params;
  try {
    const response = await http({
      method: "POST",
      url: `${baseUrl}/shop/change/broadcast`,
      data: {
        deliverId: riderId,
        id: id,
        title: title,
        content: content,
        startTime: startTime,
        endTime: endTime,
      },
      auth: true, // 需要认证
    });

    return response.data;
  } catch (error) {
    // 处理错误
    console.error("获取失败:", error);

    // 返回统一的错误格式
    return {
      success: false,
      errorMsg: error.message || "获取失败，请稍后重试",
      data: null,
    };
  }
};
