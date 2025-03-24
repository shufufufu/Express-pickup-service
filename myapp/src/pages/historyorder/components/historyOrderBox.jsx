import { View, Text, Image } from "@tarojs/components";
import {  Toast } from "@taroify/core"
import React ,{ useState }from "react";
import { Arrow } from "@taroify/icons";
import Taro from "@tarojs/taro";
import orderPic from "../../../assets/orderpic.jpg";

const HistoryOrderBox = (props) => {

  const [open, setOpen] = useState(false)


  const navigateToHistoryOrderDetail = () => {
    // 准备要传递的参数
    const { expressid, dromadd , orderTime} = props.data;
    
    // 导航到订单详情页面
    Taro.navigateTo({
      url: `/pages/historyorderinfo/index?id=${expressid}&expressid=${expressid}&dromadd=${encodeURIComponent(dromadd)}&ordertime=${orderTime}`,
    });
  };



  return (
    <View 
    className="px-2 pt-2"
    onClick={navigateToHistoryOrderDetail}
    >
      <Toast open={open} onClose={setOpen}>
        暂不支持
      </Toast>
      <View className="h-48 w-full p-2 bg-white">
        {/* 快递头部 */}
        <View className="flex justify-between">
          <View>
            <View className="text-lg">普通快递</View>
            <View className="text-gray-400 text-sm mt-1">2023-08-22 10:00:00</View>
          </View>
          <View className="flex items-center text-gray-400 text-sm mb-auto mt-1">
            已完成
            <Arrow className="ml-2" />
          </View>
        </View>
        {/* 图片和价格 */}
        <View className="mt-2 flex items-center justify-between mr-4">
          <Image
            src={orderPic}
            mode="widthFix"
            className="w-8 shadow-sm"
            onClick={() =>
              Taro.previewImage({
                current: orderPic,
                urls: [orderPic],
              })
            }
          />
          <View>
            <View className="text-lg">￥ 9</View>
            <View className="text-gray-400 text-xs">共1件</View>
          </View>
        </View>
        {/* 按钮 */}
        <View className="mt-4 flex justify-end gap-2 mr-2">
          <View 
            onClick={() => setOpen(true)}
          className="px-4 py-1 border border-gray-400 text-gray-600 text-sm rounded-sm"
          >开发票</View>
          <View className="px-4 py-1 border border-gray-400 text-gray-600 text-sm rounded-sm">评价一下</View>
          <View className="px-4 py-1 bg-black text-white text-sm rounded-sm">再来一单</View>
        </View>
      </View>
    </View>
  );
};

export default HistoryOrderBox;
