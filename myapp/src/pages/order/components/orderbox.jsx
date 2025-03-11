import { View } from "@tarojs/components";
import React, { useState } from "react";

// 渐变背景样式
const gradientStyle = {
  background: "linear-gradient(to right, #06b6d4, #3b82f6)"  // cyan-500 to blue-500
};

const OrderBox = ({ customIcons = null }) => {
  const [currentStep, setCurrentStep] = useState(1);

  // 步骤的配置 - 修复状态逻辑
  const steps = [
    { title: "已接单", status: currentStep > 1 ? "finished" : currentStep === 1 ? "active" : "pending" },
    { title: "配送中", status: currentStep > 2 ? "finished" : currentStep === 2 ? "active" : "pending" },
    { title: "已送达", status: currentStep === 3 ? "active" : "pending" }
  ];

  // 处理步骤切换
  const handleStepChange = () => {
    setCurrentStep((prev) => (prev >= 3 ? 1 : prev + 1));
  };

  // 默认箭头图标
  const DefaultArrowIcon = () => (
    <View className="w-0 h-0 mt-1 border-t-[6px] border-b-[6px] border-l-[8px] border-transparent border-l-white" />
  );

  // 默认星星图标
  const DefaultStarIcon = () => (
    <View className="w-4 h-4 mt-1 relative">
      <View className="w-4 h-4 rounded-full bg-white" />
    </View>
  );

  // 获取图标
  const getIcon = (index) => {
    // 如果提供了自定义图标，使用自定义图标
    if (customIcons && customIcons[index]) {
      return customIcons[index];
    }
    // 否则使用默认图标
    return index === 2 ? <DefaultStarIcon /> : <DefaultArrowIcon />;
  };

  return (
    <View 
      className="mx-3 my-3 p-4 rounded-lg shadow-lg" 
      style={gradientStyle}
    >
      <View className="flex justify-between items-center">
        <View className="text-2xl font-medium text-white">106-5-207</View>
        <View 
          className="px-3 py-1 bg-white/20 rounded-full text-white text-sm cursor-pointer active:bg-white/30"
          onClick={handleStepChange}
        >
          测试步骤 {currentStep}/3
        </View>
      </View>
      <View className="mt-2 text-blue-50">南湖五栋207</View>
      
      <View className="mt-6">
        <View className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              {/* 步骤和标题的容器 */}
              <View className="flex flex-col items-center flex-none">
                {/* 图标容器 */}
                <View className={`transform scale-125 ${step.status === "pending" ? "opacity-50" : "opacity-100"}`}>
                  {getIcon(index)}
                </View>
                {/* 标题文本 */}
                <View className={`mt-2 text-xs ${
                  step.status === "pending" ? "text-white/70" : "text-white font-medium"
                }`}>
                  {step.title}
                </View>
              </View>
              
              {/* 连接线 */}
              {index < steps.length - 1 && (
                <View className={`flex-1 h-[2px] mx-1 ${
                  steps[index + 1].status === "pending" ? "bg-white/50" : "bg-white"
                }`} />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>
    </View>
  );
};

export default OrderBox;
