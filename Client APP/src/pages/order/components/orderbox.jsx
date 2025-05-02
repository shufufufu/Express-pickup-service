import { View } from "@tarojs/components";
import React, { useState } from "react";
import Steps, { STEP_STATES } from "./Steps";
import { Countdown } from "@taroify/core";
import Taro from "@tarojs/taro";

// 渐变背景样式
const gradientStyle = {
  background: "linear-gradient(to right, #d4eaf7, #b6ccd8)",
};

// 状态序列用于测试
const testStatusSequence = [
  STEP_STATES.STEP1.WAITING, // 待接单
  STEP_STATES.STEP1.ACCEPTED, // 已接单
  STEP_STATES.STEP2.PICKING, // 正在取件
  STEP_STATES.STEP2.SUCCESS, // 取件成功
  STEP_STATES.STEP3.DELIVERING, // 配送中
  STEP_STATES.STEP3.DELIVERED, // 已送达
  // 额外测试失败状态
  STEP_STATES.STEP1.REJECTED, // 未接单
  STEP_STATES.STEP2.FAILED, // 取件失败
];

const OrderBox = (props) => {
  // 使用本地状态存储当前状态的索引
  const [statusIndex, setStatusIndex] = useState(props.data.status);
  const currentStatus = testStatusSequence[statusIndex];

  // 处理卡片点击，跳转到订单详情
  const navigateToOrderDetail = () => {
    // 准备要传递的参数
    const {
      expressId,
      dormAdd,
      downTime,
      createTime,
      image,
      deliverId,
      iphoneNumber,
      comment,
      id,
    } = props.data;

    // 导航到订单详情页面
    Taro.navigateTo({
      url:
        `/pages/orderinfo/index?` +
        `id=${expressId}` +
        `&expressId=${expressId}` +
        `&dormAdd=${encodeURIComponent(dormAdd)}` +
        `&stepState=${currentStatus}` +
        `&downTime=${downTime}` +
        `&orderTime=${createTime}` +
        `&image=${image}` +
        `&deliverId=${deliverId}` +
        `&iphoneNumber=${iphoneNumber}` +
        `&comment=${encodeURIComponent(comment)}` +
        `&orderId=${id}`,
    });
  };

  return (
    <View
      className="mx-3 my-3 p-4 rounded-lg shadow-lg text-[#3b3c3d]"
      style={gradientStyle}
      onClick={navigateToOrderDetail}
    >
      <View className="flex justify-between items-center">
        <View className="text-2xl font-medium text-[#3b3c3d]">
          {props.data.expressId}
        </View>
      </View>
      <View className="mt-2 text-[#3b3c3d]">{props.data.dormAdd}</View>

      {/* 倒计时容器 - 固定高度 */}
      <View className="h-[40px] flex items-center mt-3">
        {currentStatus === STEP_STATES.STEP1.WAITING && (
          <>
            <View className="text-[#3b3c3d] text-sm mr-2">剩余时间</View>
            <Countdown value={props.data.downTime}>
              {(current) => (
                <View className="flex items-center">
                  <View
                    className="inline-block bg-sky-100 text-blue-700 text-center text-lg rounded-lg"
                    style={{
                      width: "44px",
                      height: "24px",
                      lineHeight: "24px",
                    }}
                  >
                    {current.hours.toString().padStart(2, "0")}
                  </View>
                  <View className="inline-block mx-2 text-blue-700 text-sm">
                    :
                  </View>
                  <View
                    className="inline-block bg-sky-100 text-blue-700 text-center text-lg rounded-lg"
                    style={{
                      width: "44px",
                      height: "24px",
                      lineHeight: "24px",
                    }}
                  >
                    {current.minutes.toString().padStart(2, "0")}
                  </View>
                  <View className="inline-block mx-2 text-blue-700 text-sm">
                    :
                  </View>
                  <View
                    className="inline-block bg-sky-100 text-blue-700 text-center text-lg rounded-lg"
                    style={{
                      width: "44px",
                      height: "24px",
                      lineHeight: "24px",
                    }}
                  >
                    {current.seconds.toString().padStart(2, "0")}
                  </View>
                </View>
              )}
            </Countdown>
          </>
        )}
      </View>

      {/* 使用封装好的 Steps 组件，传递当前状态 */}
      <View className="pb-0 mb-0 mt-2">
        <Steps status={currentStatus} />
      </View>
    </View>
  );
};

export default OrderBox;
