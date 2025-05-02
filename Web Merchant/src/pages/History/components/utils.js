// 订单状态常量，使用数字值以匹配后端返回值
export const STEP_STATES = {
  STEP1: {
    WAITING: 0,     // 待接单
    ACCEPTED: 1,    // 已接单
    REJECTED: 2,    // 拒单
  },
  STEP2: {
    PICKING: 3,     // 取件中
    SUCCESS: 4,     // 取件成功
    FAILED: 5,      // 取件失败
  },
  STEP3: {
    DELIVERING: 6,  // 配送中
    DELIVERED: 7    // 已送达
  }
};

// 获取状态描述
export const getStatusDesc = (status) => {
  const statusNum = Number(status);
  switch (statusNum) {
    case 0:
      return "待接单"
    case 1:
      return "已接单"
    case 2:
      return "已拒单"
    case 3:
      return "取件中"
    case 4:
      return "取件成功"
    case 5:
      return "取件失败"
    case 6:
      return "配送中"
    case 7:
      return "已送达"
    default:
      return "未知状态"
  }
}

// 获取状态颜色
export const getStatusColor = (status) => {
  const statusNum = Number(status);
  switch (statusNum) {
    case 0:
      return "gold"      // 待接单 - 金色
    case 1:
      return "blue"      // 已接单 - 蓝色
    case 2:
      return "red"       // 已拒单 - 红色
    case 3:
      return "blue"      // 取件中 - 蓝色
    case 4:
      return "blue"      // 取件成功 - 蓝色
    case 5:
      return "red"       // 取件失败 - 红色
    case 6:
      return "blue"      // 配送中 - 蓝色
    case 7:
      return "green"     // 已送达 - 绿色
    default:
      return "default"   // 未知状态 - 默认颜色
  }
}
