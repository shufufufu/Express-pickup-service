import { View } from "@tarojs/components";
import { Steps, Step, Button, ConfigProvider } from '@nutui/nutui-react-taro'
import React, { useState } from "react";

const customTheme = {
  nutuiStepsBaseLineWidth: '30%',
  nutuiStepsBaseIconWidth: '10px',
  nutuiStepsBaseIconHeight: '10px',
  nutuiStepsFinishIconBgColor: '#00668c',
  nutuiStepsProcessIconBgColor: '#00668c',
  nutuiStepsWaitIconBgColor: '#00668c',
  nutuiStepsFinishLineBackground: '#00668c',
  // 设置背景为透明
  nutuiStepsBaseBackground: 'transparent',
}

const OrderBox = () => {
  const [val, setVal] = useState(1)
  
  const handleStep = () => {
    const newVal = (val % 3) + 1
    setVal(newVal)
  }
  
  return (
    <View 
      className="mx-3 my-3 p-4 rounded-lg shadow-lg h-40"
      style={{
        background: 'linear-gradient(to right, #e0f2fe, #bfdbfe)'
      }}
    >
      <View className="text-2xl font-medium text-gray-800">106-5-207</View>
      <View className="mt-2 text-gray-600">南湖五栋207</View>

      {/* 使用 Steps 组件，设置背景为透明 */}
      <View style={{ background: 'transparent' }}>
        <ConfigProvider theme={customTheme}>
          <Steps 
            value={val} 
            dot
            style={{ background: 'transparent' }}
          >
            <Step value={1} />
            <Step value={2} />
            <Step value={3} />
          </Steps>
        </ConfigProvider>
      </View>
      
      <View className="mt-2 flex justify-center">
        <Button 
          type="danger" 
          size="small" 
          onClick={handleStep}
          style={{ background: '#f43f5e' }}
        >
          下一步
        </Button>
      </View>
    </View>
  );
};

export default OrderBox;
