import React, { useState } from "react"
import { View, Text } from "@tarojs/components"
import { Cell, Field, Textarea, Button, Toast } from "@taroify/core"
import { Arrow } from "@taroify/icons"
import { getEnv, navigateBack } from "@tarojs/taro"

const env = getEnv();

function FeedBack() {
  const [feedback, setFeedback] = useState("")
  const [showToast, setShowToast] = useState(false)
  
  // 处理反馈内容变化
  const handleFeedbackChange = (event) => {
    setFeedback(event.detail.value)
  }
  
  // 处理表单提交
  const handleSubmit = () => {
    if (feedback.trim() === "") {
      setShowToast(true)
      return
    }
    
    // 这里可以添加提交逻辑，例如向后端发送请求
    console.log("提交的反馈:", feedback)
    
    // 显示提交成功提示
    setShowToast(true)
    
    // 清空输入
    setFeedback("")
    
    // 延迟返回上一页
    setTimeout(() => {
      navigateBack()
    }, 1500)
  }
  

  return (
    <View className="flex flex-col h-screen bg-gray-100">
      
      {/* 反馈内容 */}
      <View className="mt-4">
        <Cell.Group inset style={{ "--textarea-line-height": env === "WEB" ? "1.2rem" : "1" }}>
          <Field align="start" label="建议与反馈">
            <Textarea 
              //style={{ height: "120px" }} 
              limit={200} 
              placeholder="请输入您的建议和反馈，我们将努力改进..." 
              value={feedback}
              onChange={handleFeedbackChange}
            />
          </Field>
        </Cell.Group>
      </View>
      
      {/* 提交按钮 */}
      <View className="mt-8 px-4">
        <Button 
          className="w-full" 
          style={{ 
            background: "linear-gradient(to right, #d4eaf7, #b6ccd8)",
            border: "none",
            color: "#000000"
          }}
          onClick={handleSubmit}
        >
          提交反馈
        </Button>
      </View>
      
      {/* 提示消息 */}
      <Toast open={showToast} onClose={() => setShowToast(false)}>
        {feedback.trim() === "" ? "请输入反馈内容" : "感谢您的反馈！"}
      </Toast>
    </View>
  )
}

export default FeedBack;