import { http } from "@/utils/index";
import { getRiderId } from "@/utils/index";

const baseUrl = "http://26.81.202.205:8080";
const riderId = getRiderId(); // 获取骑手ID

export const fetchGetComment = async (params) => {
  const { userId, stauts, page, pageSize } = params; // 获取骑手ID
  try {
    const response = await http({
      method: "POST",
      url: `${baseUrl}/shop/selectFeedBack`,
      data: {
        userId,
        stauts,
        pastQuery: {
          page: page,
          pageSize: pageSize,
        },
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

//修改单个评论的状态
export const fetchChangeCommentStatus = async (params) => {
  const { commentId } = params; // 获取骑手ID
  try {
    const response = await http({
      method: "POST",
      url: `${baseUrl}/shop/changeFeedBackStatus`,
      data: {
        commentId,
        deliverId: riderId,
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

//一键更新当前页所有评论的状态（即全部标为已读按钮）
export const fetchChangeAllCommentStatus = async (params) => {
  const { page, pageSize } = params; // 获取骑手ID
  try {
    const response = await http({
      method: "POST",
      url: `${baseUrl}/shop/changeFeedBackStatusOnce`,
      data: {
        page: page,
        pageSize: pageSize,
        deliverId: riderId,
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
