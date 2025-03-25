import React from "react";
import { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import { PullRefresh, Empty , BackTop } from "@taroify/core";
import { usePageScroll } from "@tarojs/taro";
import HistoryOrderBox from "./components/historyOrderBox";

const initialData = [
  {
    expressid: "107-5-207",
    dromadd: "南湖五栋207",
    orderTime: Date.now() - 1000 * 60 * 60, // 下单时间：1小时前
    comment: "",
    iphoneNumber: "",
    orderid: "",
    orderImage:"",
  },
  {
    expressid: "108-3-401",
    dromadd: "南湖三栋401",
    orderTime: Date.now() - 1000 * 60 * 30, // 下单时间：30分钟前
    comment: "",
    iphoneNumber: "",
    orderid: "",
    orderImage:"",
  },
];

function HistoryOrder() {
  const [reachTop, setReachTop] = useState(true);
  const [historyOrderData, setHistoryOrderData] = useState([]);
  const [loading, setLoading] = useState(false);

  //检测页面滚动
  usePageScroll(({ scrollTop }) => setReachTop(scrollTop === 0));

  const handleRefresh = async () => {
    setLoading(true);
     // 从后端获取最新数据的逻辑需要根据实际情况进行编写，这里只是一个示例，具体实现可能会涉及到网络请求、数据处理等操作

    setTimeout(() => {
      // 模拟从后端获取历史订单数据
      const refreshedData = initialData
      
      setHistoryOrderData(refreshedData);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
  <PullRefresh
        loading={loading}
        reachTop={reachTop}
        onRefresh={handleRefresh}
        loadingText="刷新中..."
        pullingText="下拉刷新"
        loosingText="释放刷新"
        successText="刷新成功"
  >
    <View>
        <View className="pb-4 min-h-screen">
            {historyOrderData.length === 0 ? (
              <Empty>
                <Empty.Image />
                <Empty.Description>暂时没有历史订单</Empty.Description>
              </Empty>
            ) : (
              <>
                {historyOrderData.map((item, index) => (
                  <HistoryOrderBox key={index} data={item} />
                ))}
                <View className="text-center text-gray-400 text-sm mt-4">
                  —— 仅展示最近三个月的订单 ——
                </View>
                <View className="text-center text-gray-400 text-sm mt-1">
                  —— 若需获取更多数据请联系相关客服 ——
                </View>
              </>
            )}
            <BackTop
              right={30}         // 距离页面右侧的距离
              bottom={40}        // 距离页面底部的距离
              offset={200}       // 滚动高度达到200px时显示 BackTop
              onClick={() => {
                Taro.pageScrollTo({
                  scrollTop: 0,
                  duration: 300, // 滚动持续时间
                });
              }}
              zIndex={100}       // 层级
            />
          </View> 
      </View>
  </PullRefresh>
    )
}

export default HistoryOrder;