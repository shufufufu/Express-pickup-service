import { View, Image } from "@tarojs/components";
import React from "react";
import waitpickIcon from "../../../assets/waitpick.png";

// 步骤和状态的常量定义
const STEP_STATES = {
  // 第一步：接单状态
  STEP1: {
    WAITING: 10,   // 待接单
    ACCEPTED: 11,  // 已接单
    REJECTED: 12,  // 未接单
  },
  // 第二步：取件状态
  STEP2: {
    PICKING: 20,   // 正在取件
    SUCCESS: 21,   // 取件成功
    FAILED: 22,    // 取件失败
  },
  // 第三步：配送状态
  STEP3: {
    DELIVERING: 30, // 配送中
    DELIVERED: 31,  // 已送达
  }
};

const Steps = ({ status = STEP_STATES.STEP1.WAITING }) => {
  // 确定每个步骤的状态
  const getStep1Status = () => {
    // 检查第一步的状态
    if (status === STEP_STATES.STEP1.WAITING) return "pending"; // 待接单
    if (status === STEP_STATES.STEP1.REJECTED) return "error";  // 未接单
    return "finished"; // 已接单或后续步骤
  };

  const getStep2Status = () => {
    // 如果第一步未完成或未接单，则第二步为pending
    if (status < STEP_STATES.STEP1.ACCEPTED || status === STEP_STATES.STEP1.REJECTED) return "pending";
    // 如果当前状态是第二步但取件失败
    if (status === STEP_STATES.STEP2.FAILED) return "error";
    // 如果当前状态是第二步进行中
    if (status === STEP_STATES.STEP2.PICKING) return "active";
    // 如果第二步完成或进入第三步
    if (status >= STEP_STATES.STEP2.SUCCESS) return "finished";
    // 如果第一步已完成但还未进入第二步
    return "active";
  };

  const getStep3Status = () => {
    // 如果第一步未完成或第二步未完成
    if (status < STEP_STATES.STEP2.SUCCESS || status === STEP_STATES.STEP2.FAILED) return "pending";
    // 如果配送中
    if (status === STEP_STATES.STEP3.DELIVERING) return "active";
    // 如果已送达
    if (status === STEP_STATES.STEP3.DELIVERED) return "finished";
    // 如果第二步已完成但还未进入第三步
    return "active";
  };

  // 获取步骤标题
  const getStepTitle = (stepNum) => {
    switch (stepNum) {
      case 1:
        if (status === STEP_STATES.STEP1.WAITING) return "待接单";
        if (status === STEP_STATES.STEP1.REJECTED) return "未接单";
        return "已接单";
      case 2:
        if (status === STEP_STATES.STEP2.PICKING) return "正在取件";
        if (status === STEP_STATES.STEP2.FAILED) return "取件失败";
        if (status >= STEP_STATES.STEP2.SUCCESS) return "取件成功";
        return "正在取件";
      case 3:
        if (status === STEP_STATES.STEP3.DELIVERED) return "已送达";
        return "配送中";
      default:
        return "";
    }
  };

  // 步骤的配置
  const steps = [
    { title: getStepTitle(1), status: getStep1Status() },
    { title: getStepTitle(2), status: getStep2Status() },
    { title: getStepTitle(3), status: getStep3Status() }
  ];

  return(
    <View className="mt-6">
      <View className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* 步骤和标题的容器 */}
            <View className="flex flex-col items-center flex-none">
              {/* 图标容器 */}
              <View className={`${
                step.status === "pending" ? "opacity-50" : 
                step.status === "error" ? "opacity-100" :
                "opacity-100"
              }`}>
                <Image 
                  src={waitpickIcon}
                  className={`w-6 h-6 ${step.status === "error" ? "border border-red-500 rounded-full" : ""}`}
                  mode="aspectFit" 
                />
              </View>
              {/* 标题文本 */}
              <View className={`mt-2 text-xs ${
                step.status === "pending" ? "text-white/70" : 
                step.status === "error" ? "text-red-300 font-medium" :
                "text-white font-medium"
              }`}>
                {step.title}
              </View>
            </View>
            
            {/* 连接线 */}
            {index < steps.length - 1 && (
              <View className={`flex-1 h-[2px] mx-1 ${
                steps[index + 1].status === "pending" ? "bg-white/50" : 
                steps[index + 1].status === "error" ? "bg-red-300" :
                "bg-white"
              }`} />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

// 导出步骤状态常量和组件
export { STEP_STATES };
export default Steps;