import React, { useState } from "react";
import { View } from "@tarojs/components";
import { Cell, Field, Textarea, Button, Toast } from "@taroify/core";
import { getEnv, navigateBack } from "@tarojs/taro";
import { fetchFeedback } from "../../apis/index";

const env = getEnv();

function FeedBack() {
  const [feedback, setFeedback] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // 获取本地存储的上次提交时间
  const lastSubmitTime = wx.getStorageSync("lastSubmitTime") || 0;
  const now = Date.now();

  // 处理反馈内容变化
  const handleFeedbackChange = (event) => {
    setFeedback(event.detail.value);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    if (feedback.trim() === "") {
      setToastMessage("请输入反馈内容");
      setShowToast(true);
      return;
    }

    // 限制一天只能提交一次
    if (now - lastSubmitTime < 24 * 60 * 60 * 1000) {
      setToastMessage("一天只能提交一次");
      setShowToast(true);
      return;
    }

    try {
      // 调用反馈API
      await fetchFeedback(feedback);

      // 提交成功后，更新本地存储和UI
      wx.setStorageSync("lastSubmitTime", now);
      setToastMessage("感谢您的反馈！");
      setShowToast(true);

      // 清空输入框
      setFeedback("");

      // 延迟返回上一页
      setTimeout(() => {
        navigateBack();
      }, 1500);
    } catch (error) {
      console.error("提交反馈失败:", error);
      setToastMessage("提交失败，请稍后重试");
      setShowToast(true);
    }
  };

  return (
    <View className="flex flex-col h-screen bg-gray-100">
      {/* 反馈内容 */}
      <View className="mt-4">
        <Cell.Group inset style={{ "--textarea-line-height": env === "WEB" ? "1.2rem" : "1" }}>
          <Field align="start" label="建议与反馈">
            <Textarea
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
            color: "#000000",
          }}
          onClick={handleSubmit}
        >
          提交反馈
        </Button>
      </View>

      {/* 提示消息 */}
      <Toast open={showToast} onClose={() => setShowToast(false)}>
        {toastMessage}
      </Toast>
    </View>
  );
}

export default FeedBack;
