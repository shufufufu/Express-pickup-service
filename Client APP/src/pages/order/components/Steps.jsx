import { View, Image } from "@tarojs/components";
import React from "react";
import waitpickIcon from "../../../assets/waitpick.png";
import PickIcon from "../../../assets/pick1.png";
import SendIcon from "../../../assets/pickup.png";
import PickedIcon from "../../../assets/picked2.png";
import UnSendIcon from "../../../assets/send2.png";
import SendingIcon from "../../../assets/send1.png";
import FinishIcon from "../../../assets/finish2.png";
import RejectIcon from "../../../assets/reject.png";
import UnPickIcon from "../../../assets/unpick.png";

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

const Steps = ({ status = STEP_STATES.STEP1.WAITING, mode = 1 }) => {
  // 根据模式确定颜色方案
  // mode 1：白色系；mode 2：深色系（这里以黑色为例）
  const finishedTextColor = mode === 1 ? "text-white font-medium" : "text-black font-medium";
  const pendingTextColor = mode === 1 ? "text-white/70" : "text-black/50";
  const errorTextColor = "text-red-400 font-medium"; // 错误状态保持红色

  const finishedLineColor = mode === 1 ? "bg-white" : "bg-blue-500";
  const pendingLineColor = mode === 1 ? "bg-white/50" : "bg-blue-100";
  const errorLineColor = "bg-red-400";

  // 确定每个步骤的状态
  const getStep1Status = () => {
    if (status === STEP_STATES.STEP1.WAITING) return "pending"; // 待接单
    if (status === STEP_STATES.STEP1.REJECTED) return "error";  // 未接单
    return "finished"; // 已接单或后续步骤
  };

  const getStep2Status = () => {
    if (status < STEP_STATES.STEP1.ACCEPTED || status === STEP_STATES.STEP1.REJECTED) return "pending";
    if (status === STEP_STATES.STEP2.FAILED) return "error";
    if (status === STEP_STATES.STEP2.PICKING) return "active";
    if (status >= STEP_STATES.STEP2.SUCCESS) return "finished";
    return "active";
  };

  const getStep3Status = () => {
    if (status < STEP_STATES.STEP2.SUCCESS || status === STEP_STATES.STEP2.FAILED) return "pending";
    if (status === STEP_STATES.STEP3.DELIVERING) return "active";
    if (status === STEP_STATES.STEP3.DELIVERED) return "finished";
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

  // 获取步骤图标
  const getStepIcon = (stepNum, stepStatus) => {
    if (stepNum === 1) {
      if (stepStatus === "pending") return waitpickIcon;
      if (stepStatus === "error") return RejectIcon;
      return PickIcon;
    }
    if (stepNum === 2) {
      if (stepStatus === "pending") return SendIcon;
      if (stepStatus === "active") return SendIcon;
      if (stepStatus === "error") return UnPickIcon;
      return PickedIcon;
    }
    if (stepNum === 3) {
      if (stepStatus === "pending") return UnSendIcon;
      if (stepStatus === "active") return SendingIcon;
      return FinishIcon;
    }
    return waitpickIcon;
  };

  // 定义步骤配置
  const steps = [
    { 
      title: getStepTitle(1), 
      status: getStep1Status(),
      icon: getStepIcon(1, getStep1Status()) 
    },
    { 
      title: getStepTitle(2), 
      status: getStep2Status(),
      icon: getStepIcon(2, getStep2Status()) 
    },
    { 
      title: getStepTitle(3), 
      status: getStep3Status(),
      icon: getStepIcon(3, getStep3Status()) 
    }
  ];

  return (
    <View className="mt-6">
      <View className="flex items-center justify-between">
        {steps.map((step, index) => {
          // 根据状态选择文字颜色
          let textClass = "";
          if (step.status === "pending") {
            textClass = pendingTextColor;
          } else if (step.status === "error") {
            textClass = errorTextColor;
          } else {
            textClass = finishedTextColor;
          }
          return (
            <React.Fragment key={index}>
              {/* 步骤图标和标题 */}
              <View className="flex flex-col items-center flex-none">
                <View className={`${step.status === "pending" ? "opacity-50" : "opacity-100"}`}>
                  <Image 
                    src={step.icon}
                    className={`w-6 h-6 ${step.status === "error" ? "border border-red-500 rounded-full" : ""}`}
                    mode="aspectFit" 
                  />
                </View>
                <View className={`mt-2 text-xs ${textClass}`}>
                  {step.title}
                </View>
              </View>
              {/* 连接线 */}
              {index < steps.length - 1 && (
                <View 
                  className={`flex-1 h-[2px] mx-1 ${
                    steps[index + 1].status === "pending" 
                      ? pendingLineColor
                      : steps[index + 1].status === "error"
                      ? errorLineColor
                      : finishedLineColor
                  }`} 
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

export { STEP_STATES };
export default Steps;
