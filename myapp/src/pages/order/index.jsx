import { View } from "@tarojs/components";
import React, { useState, useEffect } from "react";
import OrderBox from "./components/orderbox";
import { PullRefresh } from "@taroify/core";
import { usePageScroll } from "@tarojs/taro";
import { Empty } from "@taroify/core"

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
    
    // 模拟API延迟和数据刷新
    setTimeout(() => {
      // 生成随机更新的数据
      const refreshedData = initialData.map(item => ({
        ...item,
        // 随机更新倒计时，模拟时间流逝
        downtime: Math.max(0, item.downtime - Math.floor(Math.random() * 1000 * 60 * 10)),
        // 有几率随机前进一个步骤状态
        stepstate: Math.random() > 0.7 ? Math.min(7, item.stepstate + 1) : item.stepstate
      }));
      
      setOrderData(refreshedData);
      setLoading(false);
    }, 1000);
  };

  // 首次加载时获取数据
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
        
        
        {/* 订单列表 */}
        <View className="pb-4">
          {orderData.length === 0 ? (
            <Empty>
            <Empty.Image />
            <Empty.Description>暂时没有快递</Empty.Description>
          </Empty>
          ) : (
            orderData.map((item) => (
              <OrderBox
                key={item.expressid}
                data={item}
              />
            ))
          )}
        </View>
      </PullRefresh>
    </View>
  );
}
