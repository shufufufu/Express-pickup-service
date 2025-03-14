import { View } from "@tarojs/components";
import React, { useState, useEffect } from "react";
import OrderBox from "./components/orderbox";
import { PullRefresh, Empty, NoticeBar } from "@taroify/core";
import { usePageScroll } from "@tarojs/taro";
import { VolumeOutlined } from "@taroify/icons"; // 需要正确引入图标

// 模拟数据 - 实际项目中应该从API获取
const initialData = [
  {
    expressid: "107-5-207", // 快递取件码
    dromadd: "南湖五栋207", // 宿舍地址
    downtime: 1000 * 60 * 60, // 倒计时（毫秒）
    stepstate: 0, // 步骤状态
  },
  {
    expressid: "108-3-401",
    dromadd: "南湖三栋401",
    downtime: 1000 * 60 * 30, // 30分钟
    stepstate: 1,
  },
  {
    expressid: "109-2-102",
    dromadd: "南湖二栋102",
    downtime: 1000 * 60 * 10, // 10分钟
    stepstate: 2,
  },
  {
    expressid: "109-2-102",
    dromadd: "南湖二栋102",
    downtime: 1000 * 60 * 10, // 10分钟
    stepstate: 2,
  },
  {
    expressid: "109-2-102",
    dromadd: "南湖二栋102",
    downtime: 1000 * 60 * 10, // 10分钟
    stepstate: 2,
  },
  {
    expressid: "109-2-102",
    dromadd: "南湖二栋102",
    downtime: 1000 * 60 * 10, // 10分钟
    stepstate: 2,
  },
  {
    expressid: "109-2-102",
    dromadd: "南湖二栋102",
    downtime: 1000 * 60 * 10, // 10分钟
    stepstate: 2,
  },
];


export default function Order() {
  const [orderData, setOrderData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [reachTop, setReachTop] = useState(true);

  // 检测页面滚动
  usePageScroll(({ scrollTop }) => setReachTop(scrollTop === 0));

  // 模拟从服务器获取数据
  const handleRefresh = async () => {
    setLoading(true);

    setTimeout(() => {
      const refreshedData = initialData.map((item) => ({
        ...item,
        downtime: Math.max(0, item.downtime - Math.floor(Math.random() * 1000 * 60 * 10)),
        stepstate: Math.random() > 0.7 ? Math.min(7, item.stepstate + 1) : item.stepstate,
      }));

      setOrderData(refreshedData);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <View className="bg-gray-100 min-h-screen">
      <PullRefresh
        loading={loading}
        reachTop={reachTop}
        onRefresh={handleRefresh}
        loadingText="刷新中..."
        pullingText="下拉刷新"
        loosingText="释放刷新"
        successText="刷新成功"
      >
        <View className="pb-4">
          {orderData.length === 0 ? (
            <Empty>
              <Empty.Image />
              <Empty.Description>暂时没有快递</Empty.Description>
            </Empty>
          ) : (
            <>
              <NoticeBar scrollable>
                <NoticeBar.Icon>
                  <VolumeOutlined />
                </NoticeBar.Icon>
                商家超一天没有接单则自动取消（即倒计时结束）。
              </NoticeBar>

              {orderData.map((item) => (
                <OrderBox key={item.expressid} data={item} />
              ))}
            </>
          )}
        </View>
      </PullRefresh>
    </View>
  );
}
