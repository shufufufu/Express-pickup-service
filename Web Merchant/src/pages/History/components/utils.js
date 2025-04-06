// 订单状态常量
export const STEP_STATES = {
  STEP1: {
    WAITING: "STEP1_WAITING", // 等待接单
    ACCEPTED: "STEP1_ACCEPTED", // 已接单
    REJECTED: "STEP1_REJECTED", // 已拒单
  },
  STEP2: {
    PICKING: "STEP2_PICKING", // 取件中
    SUCCESS: "STEP2_SUCCESS", // 取件成功
    FAILED: "STEP2_FAILED", // 取件失败
  },
  STEP3: {
    DELIVERING: "STEP3_DELIVERING", // 配送中
    DELIVERED: "STEP3_DELIVERED", // 已送达
  },
}

// 获取状态描述
export const getStatusDesc = (status) => {
  switch (status) {
    case STEP_STATES.STEP1.WAITING:
      return "待接单"
    case STEP_STATES.STEP1.ACCEPTED:
      return "已接单"
    case STEP_STATES.STEP1.REJECTED:
      return "已拒单"
    case STEP_STATES.STEP2.PICKING:
      return "取件中"
    case STEP_STATES.STEP2.SUCCESS:
      return "取件成功"
    case STEP_STATES.STEP2.FAILED:
      return "取件失败"
    case STEP_STATES.STEP3.DELIVERING:
      return "配送中"
    case STEP_STATES.STEP3.DELIVERED:
      return "已送达"
    default:
      return "未知状态"
  }
}

// 获取状态颜色
export const getStatusColor = (status) => {
  switch (status) {
    case STEP_STATES.STEP1.WAITING:
      return "blue"
    case STEP_STATES.STEP1.ACCEPTED:
      return "cyan"
    case STEP_STATES.STEP1.REJECTED:
      return "red"
    case STEP_STATES.STEP2.PICKING:
      return "geekblue"
    case STEP_STATES.STEP2.SUCCESS:
      return "green"
    case STEP_STATES.STEP2.FAILED:
      return "red"
    case STEP_STATES.STEP3.DELIVERING:
      return "purple"
    case STEP_STATES.STEP3.DELIVERED:
      return "green"
    default:
      return "default"
  }
}

