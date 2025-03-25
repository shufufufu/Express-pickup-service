import React from "react";
import { useState, useEffect } from "react";
import { View,ScrollView } from "@tarojs/components";
import { PullRefresh, Empty , BackTop } from "@taroify/core";
import { usePageScroll } from "@tarojs/taro";
import HistoryOrderBox from "./components/historyOrderBox";

// const initialData = [
//   {
//     expressid: "107-5-207",
//     dromadd: "南湖五栋207",
//     orderTime: Date.now() - 1000 * 60 * 60, // 下单时间：1小时前
//     comment: "",
//     iphoneNumber: "",
//     orderid: "",
//     orderImage:"",
//   },
//   {
//     expressid: "108-3-401",
//     dromadd: "南湖三栋401",
//     orderTime: Date.now() - 1000 * 60 * 30, // 下单时间：30分钟前
//     comment: "",
//     iphoneNumber: "",
//     orderid: "",
//     orderImage:"",
//   },
// ];
const PAGE_SIZE = 5; // 每次加载的数据量
const TOTAL_PAGES = 10; // 最多可加载 10 页

// ✅ 模拟后端请求数据
const mockFetchData = (page) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (page > TOTAL_PAGES) {
        resolve([]); // 超过最大页数返回空数据
        return;
      }

      const newData = Array.from({ length: PAGE_SIZE }, (_, i) => ({
        expressid: `10${page}-5-${200 + i}`,
        dromadd: `南湖${Math.floor(Math.random() * 10) + 1}栋${Math.floor(Math.random() * 400) + 100}`,
        orderTime: Date.now() - Math.floor(Math.random() * 1000000000), // 随机时间
        comment: `测试订单 ${page}-${i}`,
        iphoneNumber: `188****${Math.floor(1000 + Math.random() * 9000)}`, // 随机尾号
        orderid: `${page}${200 + i}`,
        orderImage: "",
      }));
      resolve(newData);
    }, 500); // 模拟网络请求延迟
  });
};

function HistoryOrder() {
  const [reachTop, setReachTop] = useState(true);
  const [historyOrderData, setHistoryOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // 是否还有更多数据
  const [page, setPage] = useState(1); // 当前页数
  const [isFetching, setIsFetching] = useState(false); // 避免重复加载

  //检测页面滚动
  usePageScroll(({ scrollTop }) => setReachTop(scrollTop === 0));

  // ✅ 下拉刷新（重置数据）
  const handleRefresh = async () => {
    setLoading(true);
    setPage(1);
    const newData = await mockFetchData(1);
    setHistoryOrderData(newData);
    setHasMore(newData.length === PAGE_SIZE);
    setLoading(false);
  };

  // ✅ 滑动到底部加载更多
  const loadMoreData = async () => {
    if (!hasMore || isFetching) return; // 避免重复触发
    setIsFetching(true);

    const newPage = page + 1;
    const moreData = await mockFetchData(newPage);

    if (moreData.length > 0) {
      setHistoryOrderData((prevData) => [...prevData, ...moreData]);
      setPage(newPage);
    } else {
      setHasMore(false);
    }
    
    setIsFetching(false);
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
    <ScrollView
        scrollY
        className="h-screen"
        onScrollToLower={loadMoreData} // ✅ 监听滚动到底部事件
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
                {hasMore ? (
                <View className="text-center text-gray-500 text-sm mt-4">
                  加载中...
                </View>
              ) : (
                <View>
                  <View className="text-center text-gray-400 text-sm mt-4">
                    —— 仅展示最近三个月的订单 ——
                  </View>
                  <View className="text-center text-gray-400 text-sm mt-1">
                    —— 若需获取更多数据请联系相关客服 ——
                  </View>
                </View>
              )}
                
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
      </ScrollView>
  </PullRefresh>
    )
}

export default HistoryOrder;