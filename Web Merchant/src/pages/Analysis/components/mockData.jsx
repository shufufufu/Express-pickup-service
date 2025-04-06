// 生成模拟数据
export const generateMockData = (timeRange) => {
  const dates = [];
  const totalOrders = [];
  const completedOrders = [];
  const failedOrders = [];
  const timeDistribution = [];

  const today = new Date();

  switch (timeRange) {
    case "week":
      // 近一周，以天为单位
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(
          `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
            .getDate()
            .toString()
            .padStart(2, "0")}`
        );
      }
      break;

    case "month":
      // 近一个月，以天为单位
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(
          `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
            .getDate()
            .toString()
            .padStart(2, "0")}`
        );
      }
      break;

    case "quarter":
      // 近三个月，以周为单位
      for (let i = 11; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i * 7);
        const weekEnd = new Date(date);
        weekEnd.setDate(date.getDate() + 6);
        dates.push(
          `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
            .getDate()
            .toString()
            .padStart(2, "0")}~${(weekEnd.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${weekEnd.getDate().toString().padStart(2, "0")}`
        );
      }
      break;

    case "halfYear":
      // 近半年，以月为单位
      for (let i = 5; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        dates.push(`${(date.getMonth() + 1).toString().padStart(2, "0")}月`);
      }
      break;

    default:
      // 默认一周
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(
          `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
            .getDate()
            .toString()
            .padStart(2, "0")}`
        );
      }
  }

  // 生成各时间点的数据
  for (let i = 0; i < dates.length; i++) {
    // 有20%概率生成无订单的数据点
    const hasOrders = Math.random() > 0.2;

    if (!hasOrders) {
      totalOrders.push(0);
      completedOrders.push(0);
      failedOrders.push(0);
      timeDistribution.push([0, 0, 0, 0, 0, 0]);
      continue;
    }

    // 根据不同时间范围调整基础订单量
    let baseOrders;
    switch (timeRange) {
      case "week":
        baseOrders = 100; // 日均订单基数
        break;
      case "month":
        baseOrders = 100;
        break;
      case "quarter":
        baseOrders = 700; // 周订单基数（约100/天 * 7天）
        break;
      case "halfYear":
        baseOrders = 3000; // 月订单基数（约100/天 * 30天）
        break;
      default:
        baseOrders = 100;
    }

    // 生成随机订单数据，最少有1个订单
    const total = Math.max(
      1,
      Math.floor(Math.random() * (baseOrders * 0.4)) + baseOrders
    ); // 基础订单量上下浮动40%
    const completed = Math.floor(total * (0.7 + Math.random() * 0.2)); // 70-90% 完成率
    const failed = total - completed;

    totalOrders.push(total);
    completedOrders.push(completed);
    failedOrders.push(failed);

    // 生成时间分布数据 (6个时间段)
    const timeData = [];
    let remainingOrders = total;

    // 为前5个时间段分配随机订单数
    for (let j = 0; j < 5; j++) {
      const maxOrders = Math.floor(remainingOrders * 0.5);
      const orders = Math.floor(Math.random() * maxOrders);
      timeData.push(orders);
      remainingOrders -= orders;
    }

    // 最后一个时间段分配剩余所有订单
    timeData.push(remainingOrders);

    timeDistribution.push(timeData);
  }

  return {
    dates,
    totalOrders,
    completedOrders,
    failedOrders,
    timeDistribution,
  };
};
