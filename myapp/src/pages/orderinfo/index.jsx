import React, { useState, useEffect } from "react";
import { View, Image, Text, ScrollView } from "@tarojs/components";
import { Cell, Tag, Button, Avatar, Loading, Divider, SwipeCell, Dialog, Toast } from "@taroify/core";
import { LocationOutlined, ClockOutlined, PhotoOutlined, PhoneOutlined, CommentOutlined, StarOutlined, ManagerOutlined, BillOutlined } from "@taroify/icons";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import CustomSteps from "../order/components/Steps";
import { STEP_STATES } from "../order/components/Steps";
import dayjs from 'dayjs';
import rider from "../../assets/rider.png";
import { fetchRider } from "../../apis";



const OrderInfo = () => {
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCourierDialog, setShowCourierDialog] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("text");
  const [courierInfo, setCourierInfo] = useState(null);
  
  useEffect(() => {
    // 获取路由参数
    const params = getCurrentInstance().router.params;
    const { orderId, expressId, dromAdd, stepState, downTime, orderTime, iphoneNumber, image, comment, deliverId } = params;
    
    // 获取快递员信息
    const getRiderInfo = async () => {
      if (deliverId) {
        try {
          const { data } = await fetchRider(deliverId);
          setCourierInfo(data);
          // 更新 orderData 的 courierInfo
          setOrderInfo(prevOrderInfo => ({
            ...prevOrderInfo,
            courierInfo: data
          }));
        } catch (error) {
          console.error('获取快递员信息失败:', error);
        }
      }
    };
    
    // 构造订单数据
    const orderData = {
      orderId: orderId,
      expressId: expressId,
      dromAdd: decodeURIComponent(dromAdd),
      phone: iphoneNumber,
      submitTime: dayjs(Number(orderTime)).format('YYYY-MM-DD HH:mm:ss'),
      estimatedArrival: parseInt(stepState) >= STEP_STATES.STEP1.ACCEPTED ? dayjs().add(3, 'hour').format('YYYY-MM-DD HH:mm') : '--',
      stepState: parseInt(stepState || 0),
      statusHistory: [
        { status: '已提交', time: dayjs(Number(orderTime)).format('YYYY-MM-DD HH:mm:ss'), desc: '您的订单已成功提交' },
        parseInt(stepState) >= STEP_STATES.STEP1.ACCEPTED ?
          { status: '已接单', time: dayjs().subtract(15, 'minute').format('YYYY-MM-DD HH:mm:ss'), desc: '骑手已接单，即将为您取件' } : null,
        parseInt(stepState) >= STEP_STATES.STEP2.PICKING ?
          { status: '取件中', time: dayjs().subtract(10, 'minute').format('YYYY-MM-DD HH:mm:ss'), desc: '骑手正在前往取件' } : null,
        parseInt(stepState) >= STEP_STATES.STEP2.SUCCESS ?
          { status: '已取件', time: dayjs().subtract(5, 'minute').format('YYYY-MM-DD HH:mm:ss'), desc: '骑手已成功取件' } : null,
        parseInt(stepState) >= STEP_STATES.STEP3.DELIVERING ?
          { status: '配送中', time: dayjs().subtract(3, 'minute').format('YYYY-MM-DD HH:mm:ss'), desc: '快递正在配送中' } : null,
        parseInt(stepState) >= STEP_STATES.STEP3.DELIVERED ?
          { status: '已送达', time: dayjs().format('YYYY-MM-DD HH:mm:ss'), desc: '快递已送达，感谢您的使用' } : null,
      ].filter(Boolean),
      imageUrl: image || 'https://img.yzcdn.cn/vant/cat.jpeg',
      downTime: parseInt(downTime || 3600000),
      comment: comment || '请轻拿轻放，易碎物品',
      payment: {
        amount: '3.00',
        method: '微信支付',
        time: dayjs(Number(orderTime)).add(1, 'minute').format('YYYY-MM-DD HH:mm:ss'),
        status: '已支付'
      },
      courierInfo: null
    };

    // 先设置订单的初始状态
    setOrderInfo(orderData);
    setLoading(false);

    // 获取快递员信息并更新订单数据
    if (deliverId) {
      getRiderInfo();
    }
  }, []);

  // 显示Toast
  const showToast = (message, type = "text", duration = 1500) => {
    setToastMessage(message);
    setToastType(type);
    setToastOpen(true);
    setTimeout(() => setToastOpen(false), duration);
  };
  
  // 格式化时间
  const formatTime = (ms) => {
    if (!ms) return "0分钟";
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return hours > 0 ? `${hours}小时${minutes}分钟` : `${minutes}分钟`;
  };
  
  // 获取状态颜色
  const getStatusColor = (state) => {
    if (state === STEP_STATES.STEP1.WAITING) return "primary";
    if (state === STEP_STATES.STEP1.REJECTED || state === STEP_STATES.STEP2.FAILED) return "danger";
    if (state === STEP_STATES.STEP3.DELIVERED) return "success";
    return "primary";
  };
  
  // 获取状态文字
  const getStatusText = (state) => {
    switch (state) {
      case STEP_STATES.STEP1.WAITING: return "待接单";
      case STEP_STATES.STEP1.ACCEPTED: return "已接单";
      case STEP_STATES.STEP1.REJECTED: return "未接单";
      case STEP_STATES.STEP2.PICKING: return "正在取件";
      case STEP_STATES.STEP2.SUCCESS: return "取件成功";
      case STEP_STATES.STEP2.FAILED: return "取件失败";
      case STEP_STATES.STEP3.DELIVERING: return "配送中";
      case STEP_STATES.STEP3.DELIVERED: return "已送达";
      default: return "未知状态";
    }
  };
  
  // 获取状态描述
  const getStatusDescription = (state) => {
    switch (state) {
      case STEP_STATES.STEP1.WAITING: return "订单已提交，等待骑手接单";
      case STEP_STATES.STEP1.ACCEPTED: return "骑手已接单，即将为您取件";
      case STEP_STATES.STEP1.REJECTED: return "很抱歉，订单未被接单";
      case STEP_STATES.STEP2.PICKING: return "骑手正在前往取件地点";
      case STEP_STATES.STEP2.SUCCESS: return "骑手已成功取到您的快递";
      case STEP_STATES.STEP2.FAILED: return "骑手取件失败，请联系客服";
      case STEP_STATES.STEP3.DELIVERING: return "骑手正在派送您的快递";
      case STEP_STATES.STEP3.DELIVERED: return "您的快递已送达，感谢使用";
      default: return "状态未知，请联系客服";
    }
  };
  
  // 联系骑手
  const contactCourier = () => {
    if (!orderInfo?.courierInfo) return;
    showToast("感谢您的好评", "success");
    setShowCourierDialog(false); // 关闭弹窗
  };
  
  // 查看骑手详情
  const viewCourierDetail = () => {
    setShowCourierDialog(true);
  };
  
  // 催促骑手
  const contactCustomerService = () => {
    showToast("正在催促骑手...", "loading", 1000);
    
    setTimeout(() => {
      showToast("骑手正在马不停蹄的送货中", "text", 1500);
    }, 1500);
  };
  
  // 复制订单号
  const copyOrderId = () => {
    if (!orderInfo?.orderId) return;
    
    Taro.setClipboardData({
      data: orderInfo.orderId,
      showToast: false // 禁用默认的复制提示
    }).then(() => {
      showToast("订单号已复制", "success");
    });
  };

  if (loading) {
    return (
      <View className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <Loading type="spinner" className="text-blue-400" />
        <Text className="mt-4 text-gray-500">加载订单信息...</Text>
      </View>
    );
  }

  return (
    <ScrollView scrollY className="min-h-screen bg-gray-50">
      {/* Toast组件 */}
      <Toast open={toastOpen} type={toastType}>
        {toastMessage}
      </Toast>
      
      {/* 状态卡片 */}
      <View className="mx-4 mt-4 rounded-xl overflow-hidden">
        <View className="p-5" style={{ 
          background: "linear-gradient(to right, #d4eaf7, #b6ccd8)",
          borderRadius: "12px"
        }}>
          <View className="flex items-center mb-3">
            <Tag color={getStatusColor(orderInfo.stepState)} className="mr-2 h-6">
              {getStatusText(orderInfo.stepState)}
            </Tag>
            <Text className="text-lg font-medium text-gray-800">
              {getStatusDescription(orderInfo.stepState)}
            </Text>
          </View>
          
          {orderInfo.stepState === STEP_STATES.STEP1.WAITING && (
            <View className="bg-white bg-opacity-70 p-3 rounded-lg">
              <View className="flex items-center">
                <ClockOutlined className="mr-2 text-gray-600" />
                <Text className="text-sm text-gray-700">
                  订单将在 <Text className="text-red-500 font-medium">{formatTime(orderInfo.downTime)}</Text> 后自动取消
                </Text>
              </View>
            </View>
          )}
          
          {orderInfo.stepState >= STEP_STATES.STEP1.ACCEPTED && orderInfo.stepState < STEP_STATES.STEP3.DELIVERED && (
            <View className="bg-white bg-opacity-70 p-3 rounded-lg mt-2">
              <View className="flex items-center">
                <ClockOutlined className="mr-2 text-blue-600" />
                <Text className="text-sm">
                  预计送达: <Text className="font-medium">{orderInfo.estimatedArrival}</Text>
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
      
      {/* 步骤进度 */}
      <View className="mx-4 mt-4 bg-white rounded-xl p-4">
        <Text className="text-base font-medium mb-2">订单进度</Text>
        <CustomSteps status={orderInfo.stepState} mode = {2}/>
      </View>
      
      {/* 派送员信息 */}
      {orderInfo.courierInfo && (
        <View className="mx-4 mt-4 bg-white rounded-xl overflow-hidden">
          <SwipeCell>
            <Cell>
              <View className="flex w-full py-2">
                <Avatar src={rider} size="large" />
                <View className="ml-3 flex-1">
                  <View className="flex justify-between">
                    <Text className="font-medium">{orderInfo.courierInfo.name}</Text>
                    <View className="flex items-center">
                      <StarOutlined className="text-yellow-500 mr-1" />
                      <Text className="text-yellow-500">{orderInfo.courierInfo.favor}</Text>
                    </View>
                  </View>
                  <Text className="text-sm text-gray-500 mt-1">{orderInfo.courierInfo.phone}</Text>
                  <View className="flex mt-2">
                    <Button 
                      size="mini" 
                      variant="outlined"
                      color="primary"
                      onClick={viewCourierDetail}
                    >
                      查看详情
                    </Button>
                  </View>
                </View>
              </View>
            </Cell>
          </SwipeCell>
        </View>
      )}
      
      {/* 取件信息 */}
      <View className="mx-4 mt-4 bg-white rounded-xl overflow-hidden">
        <Cell.Group>
          <Cell title="取件信息" icon={<PhotoOutlined />} />
          <Cell title="取件码">
            <View className="font-medium text-lg">{orderInfo.expressId}</View>
          </Cell>
          <Cell title="地址" icon={<LocationOutlined />}>
            <View className="text-right">{orderInfo.dromAdd}</View>
          </Cell>
          <Cell title="联系电话" icon={<PhoneOutlined />}>
            <View className="text-right">{orderInfo.phone}</View>
          </Cell>
          <Cell title="提交时间" icon={<ClockOutlined />}>
            <View className="text-right">{orderInfo.submitTime}</View>
          </Cell>
          {orderInfo.comment && (
            <Cell title="备注" icon={<CommentOutlined />}>
              <View className="text-right">{orderInfo.comment}</View>
            </Cell>
          )}
        </Cell.Group>
      </View>
      
      {/* 取件截图 */}
      <View className="mx-4 mt-4 bg-white rounded-xl overflow-hidden">
        <Cell title="取件截图" />
        <View className="p-4">
          <Image 
            src={orderInfo.imageUrl} 
            mode="widthFix" 
            className="w-full rounded-lg shadow-sm" 
            onClick={() => Taro.previewImage({
              current: orderInfo.imageUrl,
              urls: [orderInfo.imageUrl]
            })}
          />
          <Text className="text-xs text-gray-500 mt-2 block text-center">点击查看大图</Text>
        </View>
      </View>
      
      {/* 支付信息 */}
      <View className="mx-4 mt-4 bg-white rounded-xl overflow-hidden">
        <Cell title="支付信息" />
        <View className="p-4">
          <View className="flex justify-between mb-2">
            <Text className="text-gray-500">支付方式</Text>
            <Text>{orderInfo.payment.method}</Text>
          </View>
          <View className="flex justify-between mb-2">
            <Text className="text-gray-500">支付时间</Text>
            <Text>{orderInfo.payment.time}</Text>
          </View>
          <View className="flex justify-between mb-2">
            <Text className="text-gray-500">支付状态</Text>
            <Text className="text-green-500">{orderInfo.payment.status}</Text>
          </View>
          <Divider />
          <View className="flex justify-between items-center">
            <Text className="text-gray-500">实付金额</Text>
            <Text className="text-xl font-bold">¥{orderInfo.payment.amount}</Text>
          </View>
        </View>
      </View>
      
      {/* 订单时间线 */}
      <View className="mx-4 mt-4 bg-white rounded-xl overflow-hidden mb-24">
        <Cell title="订单状态历史" />
        <View className="p-4">
          {orderInfo.statusHistory.map((item, index) => (
            <View key={index} className="relative pl-6 pb-4">
              {/* 时间线 */}
              {index < orderInfo.statusHistory.length - 1 && (
                <View className="absolute left-3 top-3 bottom-0 w-px bg-gray-200" />
              )}
              {/* 圆点 */}
              <View className={`absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center ${index === 0 ? 'bg-blue-500' : 'bg-gray-200'}`}>
                <View className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-white' : 'bg-gray-400'}`} />
              </View>
              {/* 内容 */}
              <View>
                <Text className="font-medium">{item.status}</Text>
                <Text className="text-xs text-gray-500 mt-1 block">{item.time}</Text>
                <Text className="text-sm text-gray-600 mt-1">{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      
      {/* 底部操作按钮 */}
      <View className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
        <View className="flex space-x-5">
          <Button 
            block
            className="flex-2"
            style={{ 
              background: "#f5f5f5",
              border: "none",
              color: "#666666",
              borderRadius: "8px"
            }}
            onClick={copyOrderId}
          >
            复制订单号
          </Button>
          <Button 
            block
            className="flex-3"
            style={{ 
              background: "linear-gradient(to right, #d4eaf7, #b6ccd8)",
              border: "none",
              color: "#000000",
              borderRadius: "8px"
            }}
            onClick={contactCustomerService}
          >
            {"催一下：)"}
          </Button>
        </View>
      </View>
      
      {/* 骑手详情弹窗 */}
      <Dialog open={showCourierDialog} onClose={() => setShowCourierDialog(false)}>
        <Dialog.Header>骑手详情</Dialog.Header>
        <Dialog.Content>
          {orderInfo?.courierInfo && (
            <View className="p-4">
              <View className="flex justify-center mb-4">
                <Avatar src={rider} size="large" />
              </View>
              <View className="text-center mb-4">
                <Text className="text-lg font-medium">{orderInfo.courierInfo.name}</Text>
                <View className="flex items-center justify-center mt-1">
                  <StarOutlined className="text-yellow-500 mr-1" />
                  <Text className="text-yellow-500">{orderInfo.courierInfo.favor}</Text>
                </View>
              </View>
              <View className="bg-gray-50 rounded-lg p-4">
                <View className="flex justify-between mb-2">
                  <Text className="text-gray-500">联系电话</Text>
                  <Text>{orderInfo.courierInfo.phone}</Text>
                </View>
                <View className="flex justify-between mb-2">
                  <Text className="text-gray-500">配送单数</Text>
                  <Text>{orderInfo.courierInfo.doneNumber}单</Text>
                </View>
                <View className="flex justify-between">
                  <Text className="text-gray-500">加入时间</Text>
                  <Text>{orderInfo.courierInfo.joinTime}</Text>
                </View>
              </View>
            </View>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onClick={() => setShowCourierDialog(false)}>关闭</Button>
          <Button 
            style={{ 
              background: "linear-gradient(to right, #d4eaf7, #b6ccd8)",
              border: "none",
              color: "#000000"
            }}
            onClick={contactCourier}
          >
            给个好评
          </Button>
        </Dialog.Actions>
      </Dialog>
      
      {/* 底部安全区域 */}
      <View className="h-20" />
    </ScrollView>
  );
};

export default OrderInfo;