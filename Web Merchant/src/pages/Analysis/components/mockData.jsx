// 生成模拟数据，模拟后端返回的格式
export const generateMockData = (timeRange) => {
  const today = new Date();
  let dataLength;
  let dateFormat;

  // 根据时间范围确定数据长度和日期格式
  switch (timeRange) {
    case "week":
      dataLength = 7; // 7天
      dateFormat = "day";
      break;
    case "month":
      dataLength = 30; // 30天
      dateFormat = "day";
      break;
    case "quarter":
      dataLength = 12; // 12周
      dateFormat = "week";
      break;
    case "halfYear":
      dataLength = 6; // 6个月
      dateFormat = "month";
      break;
    default:
      dataLength = 7;
      dateFormat = "day";
  }

  // 生成模拟数据
  const mockData = [];

  for (let i = dataLength - 1; i >= 0; i--) {
    const date = new Date(today);
    let dateStr = "";

    // 根据不同时间范围生成日期字符串
    if (dateFormat === "day") {
      date.setDate(today.getDate() - i);
      dateStr = `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
        .getDate()
        .toString()
        .padStart(2, "0")}`;
    } else if (dateFormat === "week") {
      date.setDate(today.getDate() - i * 7);
      const weekEnd = new Date(date);
      weekEnd.setDate(date.getDate() + 6);
      dateStr = `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
        .getDate()
        .toString()
        .padStart(2, "0")}~${(weekEnd.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${weekEnd.getDate().toString().padStart(2, "0")}`;
    } else if (dateFormat === "month") {
      date.setMonth(today.getMonth() - i);
      dateStr = `${(date.getMonth() + 1).toString().padStart(2, "0")}月`;
    }

    // 有20%概率生成无订单的数据点
    const hasOrders = Math.random() > 0.2;

    if (!hasOrders) {
      mockData.push({
        all: 0,
        worked: 0,
        unWorked: 0,
        array: [0, 0, 0, 0, 0, 0],
        date: dateStr,
      });
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

    // 生成随机订单数据
    const all = Math.max(
      1,
      Math.floor(Math.random() * (baseOrders * 0.4)) + baseOrders
    );
    const worked = Math.floor(all * (0.7 + Math.random() * 0.2)); // 70-90% 完成率
    const unWorked = all - worked;

    // 生成时间分布数据 (6个时间段)
    const array = [];
    let remainingOrders = all;

    // 为前5个时间段分配随机订单数
    for (let j = 0; j < 5; j++) {
      const maxOrders = Math.floor(remainingOrders * 0.5);
      const orders = Math.floor(Math.random() * maxOrders);
      array.push(orders);
      remainingOrders -= orders;
    }

    // 最后一个时间段分配剩余所有订单
    array.push(remainingOrders);

    mockData.push({
      all,
      worked,
      unWorked,
      array,
      date: dateStr,
    });
  }

  return {
    success: true,
    errorMsg: null,
    data: mockData,
  };
};
