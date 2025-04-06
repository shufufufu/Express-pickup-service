// 生成模拟反馈数据
export const generateMockFeedbacks = (params = {}) => {
  const { page = 1, pageSize = 10, userId, feedBackStatus } = params;

  // 生成总数据
  const totalFeedbacks = [];
  const total = 68; // 模拟总反馈数

  // 用户名列表
  const userNames = [
    "张三",
    "李四",
    "王五",
    "赵六",
    "钱七",
    "孙八",
    "周九",
    "吴十",
    "郑十一",
    "王十二",
    "冯十三",
    "陈十四",
    "褚十五",
    "卫十六",
  ];

  // 反馈内容模板
  const feedbackTemplates = [
    "送餐速度很快，服务态度也很好，非常满意！",
    "希望能够增加更多的配送员，高峰期等待时间太长了。",
    "我的订单送错了，但是配送员很快就解决了问题，态度很好。",
    "建议增加实时追踪功能，这样我们可以知道订单的准确位置。",
    "配送员迟到了，但是没有提前通知我，这点需要改进。",
    "App界面设计很好，使用起来很方便，但是有时候会卡顿。",
    "我的食物送达时已经凉了，希望能改进保温措施。",
    "配送员很有礼貌，还帮我把东西送到了楼上，非常感谢！",
    "订单显示已送达，但实际上我并没有收到，这种情况已经发生多次了。",
    "希望能增加更多的支付方式，比如支持校园卡支付。",
    "有时候订单状态更新不及时，显示还在配送但实际已经送到了。",
    "建议增加预约配送功能，这样可以更好地安排时间。",
    "配送范围可以再扩大一些吗？我们宿舍区有时候不在配送范围内。",
    "App经常崩溃，特别是在下单高峰期，希望能够优化一下。",
    "价格有点贵，希望能有更多的优惠活动。",
    "我很喜欢你们的服务，一直都在使用，希望能越做越好！",
    "有时候商家和配送信息不匹配，导致找不到人，建议改进一下系统。",
    "配送员态度恶劣，希望加强培训。",
    "我的特殊要求（不要辣）没有被满足，希望能加强这方面的管理。",
    "总体来说服务不错，但偶尔会有延迟，希望能改进。",
  ];

  // 生成所有反馈
  for (let i = 1; i <= total; i++) {
    const userId = Math.floor(Math.random() * 1000) + 1;
    const feedBackStatus = Math.random() > 0.4 ? 1 : 0; // 60%已读，40%未读
    const deliverId =
      feedBackStatus === 1 ? Math.floor(Math.random() * 10) + 1 : null;
    const feedBackTime =
      Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000); // 30天内随机时间

    const feedback = {
      id: i,
      userId,
      userName: userNames[userId % userNames.length],
      comment:
        feedbackTemplates[i % feedbackTemplates.length] +
        (Math.random() > 0.7
          ? "\n\n补充：" + feedbackTemplates[(i + 5) % feedbackTemplates.length]
          : ""),
      feedBackTime,
      feedBackStatus,
      deliverId,
    };

    totalFeedbacks.push(feedback);
  }

  // 应用筛选条件
  let filteredFeedbacks = [...totalFeedbacks];

  if (userId) {
    filteredFeedbacks = filteredFeedbacks.filter(
      (feedback) => String(feedback.userId) === String(userId)
    );
  }

  if (feedBackStatus !== undefined) {
    filteredFeedbacks = filteredFeedbacks.filter(
      (feedback) => feedback.feedBackStatus === feedBackStatus
    );
  }

  // 计算分页
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedFeedbacks = filteredFeedbacks.slice(startIndex, endIndex);

  return {
    data: paginatedFeedbacks,
    page,
    pageSize,
    total: filteredFeedbacks.length,
  };
};
