// STEP_STATES.js
// 数字状态码映射到字符串状态
const STATUS_MAP = {
  0: "STEP1_WAITING",     // 待接单
  1: "STEP1_ACCEPTED",    // 已接单
  2: "STEP1_REJECTED",    // 拒单
  3: "STEP2_PICKING",     // 正在取件
  4: "STEP2_SUCCESS",     // 取件成功
  5: "STEP2_FAILED",      // 取件失败
  6: "STEP3_DELIVERING",  // 配送中
  7: "STEP3_DELIVERED"    // 已送达
};

// 将数字状态码转换为字符串状态
export const mapStatus = (statusCode) => {
  return STATUS_MAP[statusCode] || "未知状态";
};

const STATUS_NUMBER = {
  STEP1_WAITING: 0,     // 待接单
  STEP1_ACCEPTED: 1,    // 已接单
  STEP1_REJECTED: 2,    // 拒单
  STEP2_PICKING: 3,     // 正在取件
  STEP2_SUCCESS: 4,     // 取件成功
  STEP2_FAILED: 5,      // 取件失败
  STEP3_DELIVERING: 6,  // 配送中
  STEP3_DELIVERED: 7    // 已送达
};

export const STEP_STATES = {
  STEP1: {
    WAITING: 0,     // 待接单
    ACCEPTED: 1,    // 已接单
    REJECTED: 2,    // 拒单
  },
  STEP2: {
    PICKING: 3,     // 正在取件
    SUCCESS: 4,     // 取件成功
    FAILED: 5,      // 取件失败
  },
  STEP3: {
    DELIVERING: 6,  // 配送中
    DELIVERED: 7,   // 已送达
  }
};

// 获取状态描述
export const getStatusDesc = (status) => {
  switch (status) {
    case STEP_STATES.STEP1.WAITING:
      return "待接单";
    case STEP_STATES.STEP1.ACCEPTED:
      return "已接单";
    case STEP_STATES.STEP1.REJECTED:
      return "已拒单";
    case STEP_STATES.STEP2.PICKING:
      return "正在取件";
    case STEP_STATES.STEP2.SUCCESS:
      return "取件成功";
    case STEP_STATES.STEP2.FAILED:
      return "取件失败";
    case STEP_STATES.STEP3.DELIVERING:
      return "配送中";
    case STEP_STATES.STEP3.DELIVERED:
      return "已送达";
    default:
      return "未知状态";
  }
};

// 获取状态对应的颜色
export const getStatusColor = (status) => {
  switch (status) {
    case STEP_STATES.STEP1.WAITING:
      return "gold";
    case STEP_STATES.STEP1.ACCEPTED:
      return "blue";
    case STEP_STATES.STEP1.REJECTED:
      return "red";
    case STEP_STATES.STEP2.PICKING:
      return "blue";
    case STEP_STATES.STEP2.SUCCESS:
      return "blue";
    case STEP_STATES.STEP2.FAILED:
      return "red";
    case STEP_STATES.STEP3.DELIVERING:
      return "blue";
    case STEP_STATES.STEP3.DELIVERED:
      return "green";
    default:
      return "default";
  }
};

// 获取下一个状态
export const getNextStatus = (currentStatus) => {
  switch (currentStatus) {
    case STEP_STATES.STEP1.WAITING:
      return STEP_STATES.STEP1.ACCEPTED;
    case STEP_STATES.STEP1.ACCEPTED:
      return STEP_STATES.STEP2.PICKING;
    case STEP_STATES.STEP2.PICKING:
      return STEP_STATES.STEP2.SUCCESS;
    case STEP_STATES.STEP2.SUCCESS:
      return STEP_STATES.STEP3.DELIVERING;
    case STEP_STATES.STEP3.DELIVERING:
      return STEP_STATES.STEP3.DELIVERED;
    default:
      return currentStatus;
  }
};
