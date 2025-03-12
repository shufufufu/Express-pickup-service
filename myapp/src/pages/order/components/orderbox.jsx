import { View } from "@tarojs/components";
import React, { useState } from "react";
import Steps, { STEP_STATES } from "./Steps";
import { Countdown } from "@taroify/core";

// 渐变背景样式
const gradientStyle = {
  background: "linear-gradient(to right, #d4eaf7, #b6ccd8)"  // cyan-500 to blue-500
};

// 状态序列用于测试
const testStatusSequence = [
  STEP_STATES.STEP1.WAITING,   // 待接单
  STEP_STATES.STEP1.ACCEPTED,  // 已接单
  STEP_STATES.STEP2.PICKING,   // 正在取件
  STEP_STATES.STEP2.SUCCESS,   // 取件成功
  STEP_STATES.STEP3.DELIVERING, // 配送中
  STEP_STATES.STEP3.DELIVERED,  // 已送达
  // 额外测试失败状态
  STEP_STATES.STEP1.REJECTED,  // 未接单
  STEP_STATES.STEP2.FAILED,    // 取件失败
];

const OrderBox = ({ roomNumber = "106-5-207", address = "南湖五栋207" }) => {
  // 使用本地状态存储当前状态的索引
  const [statusIndex, setStatusIndex] = useState(0);
  const currentStatus = testStatusSequence[statusIndex];
  
  // 获取当前状态的描述
  const getStatusDesc = () => {
    switch (currentStatus) {
      case STEP_STATES.STEP1.WAITING: return "待接单";
      case STEP_STATES.STEP1.ACCEPTED: return "已接单";
      case STEP_STATES.STEP1.REJECTED: return "未接单";
      case STEP_STATES.STEP2.PICKING: return "正在取件";
      case STEP_STATES.STEP2.SUCCESS: return "取件成功";
      case STEP_STATES.STEP2.FAILED: return "取件失败";
      case STEP_STATES.STEP3.DELIVERING: return "配送中";
      case STEP_STATES.STEP3.DELIVERED: return "已送达";
      default: return "未知状态";
    }
  };
  
  // 处理步骤切换
  const handleCycleStatus = () => {
    setStatusIndex(prev => (prev + 1) % testStatusSequence.length);
  };

  return (
    <View 
      className="mx-3 my-3 p-4 rounded-lg shadow-lg text-[#3b3c3d]" 
      style={gradientStyle}
    >
      <View className="flex justify-between items-center">
        <View className="text-2xl font-medium text-[#3b3c3d]">{roomNumber}</View>
        <View 
          className="px-3 py-1 bg-white/20 rounded-full text-[#3b3c3d] text-sm cursor-pointer active:bg-white/30"
          onClick={handleCycleStatus}
        >
          测试: {getStatusDesc()}
        </View>
      </View>
      <View className="mt-2 text-[#3b3c3d]">{address}</View>
      
      {/* 倒计时组件 */}
      <View className="flex items-center mt-3">
        <View className="text-[#3b3c3d] text-sm mr-2">剩余时间</View>
        <Countdown value={30 * 60 * 60 * 1000}>
          {(current) => (
            <View className="flex items-center">
              <View className="inline-block w-[44px] h-[24px] leading-[24px] bg-sky-100 text-blue-700 text-center text-sm rounded-lg">
                {current.hours.toString().padStart(2, '0')}
              </View>
              <View className="inline-block mx-2 text-blue-700 text-sm">:</View>
              <View className="inline-block w-[44px] h-[24px] leading-[24px] bg-sky-100 text-blue-700 text-center text-sm rounded-lg">
                {current.minutes.toString().padStart(2, '0')}
              </View>
              <View className="inline-block mx-2 text-blue-700 text-sm">:</View>
              <View className="inline-block w-[44px] h-[24px] leading-[24px] bg-sky-100 text-blue-700 text-center text-sm rounded-lg">
                {current.seconds.toString().padStart(2, '0')}
              </View>
            </View>
          )}
        </Countdown>
      </View>
      
      {/* 使用封装好的 Steps 组件，传递当前状态 */}
      <View className="pb-0 mb-0">
        <Steps status={currentStatus} />
      </View>
    </View>
  );
};

export default OrderBox;
