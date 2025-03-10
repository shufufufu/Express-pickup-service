import { View } from "@tarojs/components";
import { Progress } from "@nutui/nutui-react-taro";
import { Steps, Step, Button, ConfigProvider } from '@nutui/nutui-react-taro'
import React, { useState } from "react";

const customTheme = {
  nutuiStepsBaseLineWidth: '30%',
}

const OrderBox = () => {
  // 使用 NutUI 的 Progress 组件
  const [val, setVal] = useState(1)
  const handleStep = () => {
    const newVal = (val % 3) + 1
    setVal(newVal)
  }
  return (
    <View className="mx-3 my-3 p-4 rounded-lg shadow-lg bg-gradient-to-r from-blue-50 to-blue-200 h-40">
      <View className="text-2xl font-medium text-gray-800">106-5-207</View>
      <View className="mt-2 text-gray-600">南湖五栋207</View>

      {/* 使用 Progress 组件模拟步骤条 */}
      <ConfigProvider theme={customTheme}>
        <Steps value={val} dot>
          <Step value={1} />
          <Step value={2} />
          <Step value={3} />
        </Steps>
      </ConfigProvider>
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <Button type="danger" onClick={() => handleStep()}>
          下一步
        </Button>
      </div>
    </View>
  );
};

export default OrderBox;
