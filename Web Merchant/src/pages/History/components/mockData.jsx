// 生成模拟订单数据
export const generateMockOrders = (params = {}) => {
  const {
    page = 1,
    pageSize = 20,
    userId,
    deliverId,
    status,
    beginTime,
    endTime,
    id,
  } = params;

  // 生成总数据
  const totalOrders = [];
  const total = 156; // 模拟总订单数

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

  // 订单状态列表
  const statuses = [
    "STEP1_WAITING",
    "STEP1_ACCEPTED",
    "STEP1_REJECTED",
    "STEP2_PICKING",
    "STEP2_SUCCESS",
    "STEP2_FAILED",
    "STEP3_DELIVERING",
    "STEP3_DELIVERED",
  ];

  // 生成所有订单
  for (let i = 1; i <= total; i++) {
    const userId = Math.floor(Math.random() * 1000) + 1;
    const deliverId = Math.floor(Math.random() * 10) + 1;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createTime =
      Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000); // 30天内随机时间

    const order = {
      id: i, // 订单号
      userId,
      userName: userNames[userId % userNames.length],
      deliverId,
      expressId: `${Math.floor(1000 + Math.random() * 9000)}`, // 取件码
      dormAdd: `第${Math.floor(Math.random() * 10) + 1}宿舍楼 ${
        Math.floor(Math.random() * 5) + 1
      }单元 ${Math.floor(Math.random() * 900) + 100}室`,
      status,
      image:
        "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      comment: Math.random() > 0.7 ? `备注${i}` : "",
      iphoneNumber: `1${Math.floor(Math.random() * 9) + 3}${String(
        Math.floor(Math.random() * 100000000)
      ).padStart(8, "0")}`,
      createTime,
    };

    totalOrders.push(order);
  }

  // 应用筛选条件
  let filteredOrders = [...totalOrders];

  if (userId) {
    filteredOrders = filteredOrders.filter(
      (order) => String(order.userId) === String(userId)
    );
  }

  if (deliverId) {
    filteredOrders = filteredOrders.filter(
      (order) => String(order.deliverId) === String(deliverId)
    );
  }

  if (status) {
    filteredOrders = filteredOrders.filter((order) => order.status === status);
  }

  if (id) {
    filteredOrders = filteredOrders.filter(
      (order) => String(order.id) === String(id)
    );
  }

  if (beginTime && endTime) {
    filteredOrders = filteredOrders.filter(
      (order) => order.createTime >= beginTime && order.createTime <= endTime
    );
  }

  // 计算分页
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  return {
    data: paginatedOrders,
    page,
    pageSize,
    total: filteredOrders.length,
  };
};
