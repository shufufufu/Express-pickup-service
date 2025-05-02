import { http } from "@/utils/index";
import { getRiderId } from "@/utils/index";

const baseUrl = "http://8.152.204.181:8080";
const riderId = getRiderId(); // 获取骑手ID

export const fetchGetComment = async (params) => {
  const { userId, status, page, pageSize } = params;
  try {
    const response = await http({
      method: "POST",
      url: `${baseUrl}/shop/selectFeedBack`,
      data: {
        userId,
        status,
        pastQuery: {
          page: page,
          pageSize: pageSize,
        },
      },
      auth: true,
    });

    if (!response.data.success) {
      return {
        success: false,
        errorMsg: response.data.errorMsg || "获取反馈数据失败",
        data: {
          order: [],
          total: 0,
        },
      };
    }

    // 如果数据存在但不是预期的格式，进行转换
    const responseData = response.data.data || {};
    if (!responseData.order) {
      // 如果返回的是数组，转换为预期格式
      const dataArray = Array.isArray(responseData) ? responseData : [];
      return {
        success: true,
        errorMsg: null,
        data: {
          order: dataArray,
          total: dataArray.length,
        },
      };
    }

    // 如果已经是正确的格式，直接返回
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

//修改单个评论的状态
export const fetchChangeCommentStatus = async (params) => {
  const { commentId } = params;
  try {
    const response = await http({
      method: "PUT",
      url: `${baseUrl}/shop/changeFeedBackStatus/${commentId}/${riderId}`,
      auth: true, // 需要认证
    });

    return response.data; //更新成功返回success 更新失败返回error
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

//一键更新当前页所有评论的状态（即全部标为已读按钮）
export const fetchChangeAllCommentStatus = async (params) => {
  const { page, pageSize, status, userId } = params;

  try {
    const response = await http({
      method: "POST",
      url: `${baseUrl}/shop/changeFeedBackStatusOnce`,
      data: {
        id: riderId,
        status,
        userId,
        pastQuery: {
          page: page,
          pageSize: pageSize,
        },
      },
      auth: true, // 需要认证
    });

    return response.data; //更新成功返回success 更新失败返回error
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
