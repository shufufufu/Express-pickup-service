import { View } from "@tarojs/components";
import React, { useState, useEffect } from "react";
import OrderBox from "./components/orderbox";
import { PullRefresh, Empty, NoticeBar, BackTop } from "@taroify/core";
import { usePageScroll } from "@tarojs/taro";
import { VolumeOutlined } from "@taroify/icons"; // 需要正确引入图标
import { checkLoginStatus } from "../../utils/auth"; // 更新导入路径
import LoginPopup from "../../components/LoginPopup";
import Taro from "@tarojs/taro";
import { fetchOrder } from "../../apis";
import { useDidShow } from "@tarojs/taro";

const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数

export default function Order() {
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reachTop, setReachTop] = useState(true);
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);

  // 检测页面滚动
  usePageScroll(({ scrollTop }) => setReachTop(scrollTop === 0));

  // 从服务器获取数据，并计算剩余时间（倒计时）
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const { data } = await fetchOrder();
      const now = Date.now();
      const refreshedData = data.map((item) => {
        // 计算下单后经过的时间
        const elapsed = now - item.createTime;
        // 剩余时间 = 24小时 - 已经过的时间（不处理订单过期的逻辑）
        const downTime = Math.max(0, oneDay - elapsed);
        return {
          ...item,
          downTime, // 传给 OrderBox 用于展示倒计时（单位：毫秒）
        };
      });
      setOrderData(refreshedData);
    } catch (error) {
      console.error("获取订单数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 检查登录状态，未登录则显示登录弹窗
    checkLoginOnMount();
    // 加载订单数据
    handleRefresh();
  }, []);

  // 页面显示时重新获取订单数据
  useDidShow(() => {
    handleRefresh();
  });

  // 检查是否需要显示登录弹窗
  const checkLoginOnMount = () => {
    const isLoggedIn = checkLoginStatus();
    if (!isLoggedIn) {
      // 延迟一点显示弹窗，让页面先渲染出来
      setTimeout(() => {
        setLoginPopupOpen(true);
      }, 500);
    }
  };

  // 关闭登录弹窗的回调
  const handleCloseLoginPopup = () => {
    setLoginPopupOpen(false);
    // 重新检查登录状态
    const isLoggedIn = checkLoginStatus();
    if (isLoggedIn) {
      // 登录成功后重新加载数据
      handleRefresh();
    }
  };
  const delayedRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      handleRefresh(); // 调用原来的刷新函数
    }, 500); // 延迟 500ms
  };

  return (
    <PullRefresh
      loading={loading}
      reachTop={reachTop}
      onRefresh={delayedRefresh}
      loadingText="刷新中..."
      pullingText="下拉刷新"
      loosingText="释放刷新"
      successText="刷新成功"
    >
      <View className="bg-gray-100 min-h-screen">
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

              {orderData.map((item, index) => (
                <OrderBox key={index} data={item} />
              ))}
            </>
          )}
          <BackTop
            right={30} // 距离页面右侧的距离
            bottom={40} // 距离页面底部的距离
            offset={200} // 滚动高度达到200px时显示 BackTop
            onClick={() => {
              Taro.pageScrollTo({
                scrollTop: 0,
                duration: 300, // 滚动持续时间
              });
            }}
            zIndex={100} // 层级
          />
        </View>

        {/* 登录弹窗 */}
        <LoginPopup open={loginPopupOpen} onClose={handleCloseLoginPopup} />
      </View>
    </PullRefresh>
  );
}
